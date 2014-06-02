
var IonicSnapshot = function(options) {

  // modules
  var _ = require('lodash');
  var request = require('request');
  var colors = require('gulp-util').colors;
  var log = console.log.bind(console, '[' + colors.cyan('IonicReporter') + ']');

  var IonicReporter = function(options) {
    var self = this;

    // set options and defaults
    self.domain = options.domain || 'ionic-snapshot-go.appspot.com';
    self.groupId = options.groupId || 'test_group';
    self.appId = options.appId || 'test_app';
    self.testId = browser.params.test_id || 'test_id';
    self.platformId = browser.params.platform_id;
    self.sleepBetweenSpecs = options.sleepBetweenSpecs || 450;
    self.width = browser.params.width || -1;
    self.height = browser.params.height || -1;
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
          width: self.width,
          height: self.height,
          browser: capabilities.get('browserName'),
          platform: capabilities.get('platform'),
          version: capabilities.get('version'),
          access_key: options.accessKey
        };
      });
    });

    process.on('exit', function() {
      log(colors.green('Highest Mismatch:'), self.highestMismatch, '%');
    });

    log('init:', _.pick(self, ['testId', 'appId', 'width', 'height', 'platformId']));
  };

  IonicReporter.prototype.reportSpecResults = function(spec) {
    var self = this;

    if(!self.testData.total_specs) {
      self.testData.total_specs = 0;
      var allSpecs = jasmine.getEnv().currentRunner().specs()
      for(var sId in allSpecs) {
        self.testData.total_specs++;
      }
    }

    self.flow.execute(function(){
      var d = protractor.promise.defer();

      browser.waitForAngular().then(function(){

        browser.sleep(self.sleepBetweenSpecs).then(function(){

          browser.takeScreenshot().then(function(pngBase64){
            log('spec:', spec.id + 1, 'of', self.testData.total_specs);

            self.testData.spec_id = spec.id;
            self.testData.description = spec.getFullName();
            self.testData.highest_mismatch = self.highestMismatch;
            self.testData.png_base64 = pngBase64;
            pngBase64 = null;

            request.post(
              'http://' + self.domain + '/screenshot',
              { form: self.testData },
              function (error, response, body) {
                log('reportSpecResults:', body);
                try {
                  var rspData = JSON.parse(body);
                  self.highestMismatch = Math.max(self.highestMismatch, rspData.Mismatch);
                } catch(e) {
                  log(colors.red('reportSpecResults error posting screenshot:'), e);
                }
                d.fulfill();
              }
            );
          });

        });

      });

      return d.promise;
    });
  };

  this.jasmine.getEnv().addReporter( new IonicReporter(options) );

};

module.exports = IonicSnapshot;
