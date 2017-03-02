var q = require('q');

var IonicSnapshot = function(options) {

  // modules
  var _ = require('lodash');
  var request = require('request');
  var colors = require('gulp-util').colors;
  var log = console.log.bind(console);

  var IonicReporter = function(options) {
    var self = this;

    // set options and defaults
    self.domain = options.domain || 'ionic-snapshot-go.appspot.com';
    self.groupId = options.groupId || 'test_group';
    self.appId = options.appId || 'test_app';
    self.build = (browser.params.dev === 'true') ? 'Development' : 'Production';
    self.sleepBetweenSpecs = self.build === 'Development' ? 3000 : (options.sleepBetweenSpecs || 500);
    self.testId = browser.params.test_id || 'test_id';
    self.shouldUpload = browser.params.upload !== 'false';
    self.platformId = browser.params.platform_id;
    self.platformIndex = browser.params.platform_index;
    self.platformCount = browser.params.platform_count;
    self.width = browser.params.width || -1;
    self.height = browser.params.height || -1;

    self.screenshotRequestPromises = [];
    self.results = {};
    self.mismatches = [];
    self.highestMismatch = 0;

    self.flow = protractor.promise.controlFlow();

    if(self.width > 0 && self.height > 0) {
      self.flow.execute(function(){
        return browser.driver.manage().window().setSize(self.width, self.height);
      });
    }
    self.flow.execute(function(){
      return browser.getCapabilities().then(function (capabilities) {
        self.testData = {
          group_id: self.groupId,
          app_id: self.appId,
          test_id: self.testId,
          platform_id: self.platformId,
          platform_index: self.platformIndex,
          platform_count: self.platformCount,
          width: self.width,
          height: self.height,
          browser: capabilities.get('browserName'),
          platform: capabilities.get('platform'),
          version: capabilities.get('version'),
          access_key: options.accessKey
        };
      });
    });

    process.on('exit', function(code) {
      if (!self.shouldUpload || code === 1) return;

      if (self.highestMismatch > 1) {
        log(colors.red('Highest Mismatch: ' + self.highestMismatch + '%'));
      } else if (self.highestMismatch > 0) {
        log(colors.yellow('Highest Mismatch: ' + self.highestMismatch + '%'));
      } else {
        log(colors.green('No Mismatches!!'));
      }

      if (!self.mismatches.length) return;

      self.mismatches.sort();

      for (var x = 0; x < self.mismatches.length; x++) {
        var result = self.results[self.mismatches[x]];

        if (result.mismatch > 1) {
          log(colors.red('Mismatch:'), colors.red(result.mismatch + '%'), result.name);
        } else {
          log(colors.yellow('Mismatch:'), colors.yellow(result.mismatch + '%'), result.name);
        }

        log('         ', colors.gray(result.compareUrl));
      }
    });

    log(colors.green('Start ' + self.build + ' Snapshot - ' + self.sleepBetweenSpecs + ' between Specs:'),
        self.groupId, self.appId, self.platformId, self.testId, '(' + self.width + 'x' + self.height + ')');

  };

  IonicReporter.prototype.reportSpecResults = function(spec) {
    var self = this;

    if(!self.testData.total_specs) {
      self.testData.total_specs = 0;
      var allSpecs = jasmine.getEnv().currentRunner().specs();
      for(var sId in allSpecs) {
        self.testData.total_specs++;
      }
    }

    self.flow.execute(function(){
      var d = protractor.promise.defer();

      browser.getCurrentUrl().then(function(currentUrl) {

        browser.sleep(self.sleepBetweenSpecs).then(function(){

          if (!self.shouldUpload) {
            return d.fulfill();
          }

          browser.takeScreenshot().then(function(pngBase64) {
            var specIdString = '[' + (spec.id+1) + '/' + self.testData.total_specs + ']';

            self.testData.spec_index = spec.id;
            // console.log('spec.id: ', spec.id);
            self.testData.highest_mismatch = self.highestMismatch;
            self.testData.png_base64 = pngBase64;
            self.testData.description = spec.getFullName().replace('components/', '').replace('test/', '').replace('www', '');
            self.testData.url = currentUrl.replace('dist', '').replace('components/', '').replace('test/', '').replace('&ionicanimate=false', '').replace('www/', '');
            //console.log('self.testData.description: ', self.testData.description);
            //console.log('self.testData.url: ', self.testData.url);
            pngBase64 = null;

            var requestDeferred = q.defer();
            self.screenshotRequestPromises.push(requestDeferred.promise);

            request.post(
              'http://' + self.domain + '/screenshot',
              { form: self.testData },
              function (error, response, body) {
                try {
                  if (error) {
                    log(specIdString, colors.red('error posting screenshot:'), error);

                  } else if (response.statusCode >= 400) {
                    log(specIdString, colors.red('error posting screenshot:'), response.statusCode, body);

                  } else {
                    var rspData = JSON.parse(body);
                    self.highestMismatch = Math.max(self.highestMismatch, rspData.Mismatch);

                    var mismatch = Math.round(rspData.Mismatch * 100) / 100;

                    if (rspData.Mismatch > 1) {
                      log(specIdString, colors.red('Mismatch: ' + mismatch + '%'), colors.gray(spec.getFullName()));
                    } else if (rspData.Mismatch > 0) {
                      log(specIdString, colors.yellow('Mismatch: ' + mismatch + '%'), colors.gray(spec.getFullName()));
                    } else {
                      log(specIdString, colors.green('Mismatch: ' + mismatch + '%'), colors.gray(spec.getFullName()));
                    }

                    var resultKey = (((rspData.Mismatch * 1000) + 1000000) + '').split('.')[0] + '-' + spec.id;
                    self.results[resultKey] = {
                      index: spec.id,
                      name: spec.getFullName(),
                      mismatch: mismatch,
                      compareUrl: rspData.CompareUrl,
                      screenshotUrl: rspData.ScreenshotUrl,
                    };

                    if (rspData.IsMismatch) {
                      self.mismatches.push(resultKey);
                    }
                  }

                } catch(e) {
                  log(specIdString, colors.red('error parsing screenshot response:'), e);
                  process.exit(1);
                }
                requestDeferred.resolve();
              }
            );
            d.fulfill();
          });

        });

      });

      return d.promise;
    });
  };

  IonicReporter.prototype.reportRunnerResults = function() {
    var self = this;

    if (!self.shouldUpload) return;

    self.flow.execute(function() {
      var d = protractor.promise.defer();
      log('Waiting for all screenshots to be posted...');
      // allSettled waits until all the promises are done, whether they are rejected or resolved
      q.allSettled(self.screenshotRequestPromises).then(function(all) {
        d.fulfill();
        log('Finished!');
      });
    });
  };



  this.jasmine.getEnv().addReporter( new IonicReporter(options) );

};

module.exports = IonicSnapshot;
