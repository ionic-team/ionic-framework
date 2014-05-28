
var IonicSnapshot = function(options) {

  // modules
  var request = require('request');

  var IonicReporter = function(options) {
    var self = this;

    // set options and defaults
    self.compare = options.compare || 'master';
    self.capabilityTestId = options.capabilityTestId || null;
    self.compareCapabilityTestId = options.compareCapabilityTestId || null;
    self.groupId = options.groupId || 'test_group';
    self.appId = options.appId || 'test_app';
    self.testId = options.testId || 'test_id';
    self.domain = options.domain || 'ionic-snapshot.appspot.com';
    self.sleepBetweenSpecs = options.sleepBetweenSpecs || 600;
    self.startTime = Date.now();
    self.totalCompares = 0;
    self.totalRMS = 0;
    self.highestRMS = 0;
    self.accessKey = options.accessKey;
    self.ptor = protractor.getInstance();

    console.log('Test Id:', self.testId);

    self.flow = protractor.promise.controlFlow();

    // set browser size
    self.width = options.width;
    self.height = options.height;
    if(self.width && self.height) {
      self.flow.execute(function(){
        return browser.driver.manage().window().setSize(self.width, self.height);
      });
    }

    self.flow.execute(function(){
      var d = protractor.promise.defer();

      browser.getCapabilities().then(function (capabilities) {

        var data = {
          compare: self.compare,
          test_id: self.testId,
          browser: capabilities.get('browserName'),
          platform: capabilities.get('platform'),
          version: capabilities.get('version')
        };

        request.post(
          'http://' + self.domain + '/' + self.groupId + '/' + self.appId + '/test',
          { form: data },
          function (error, response, body) {
            console.log(body);
            if(!error && response.statusCode == 200) {
              try {
                var jsonData = JSON.parse(body);
                self.capabilityTestId = jsonData.capability_test_id;
                self.compareResultId = jsonData.compare_result_id;
              } catch(e) {
                console.error('Error creating test');
                console.error(e);
              }
            }
            d.fulfill();
          }
        );

      });
      return d.promise;
    });

  };

  IonicReporter.prototype.reportSpecResults = function(spec) {
    var self = this;

    self.flow.execute(function(){
      var d = protractor.promise.defer();

      browser.waitForAngular().then(function(){

        self.ptor.getCurrentUrl().then(function(currentAppUrl){

          browser.sleep(self.sleepBetweenSpecs).then(function(){

            browser.takeScreenshot().then(function(pngBase64){

              var data = {
                compare_result_id: self.compareResultId,
                group_id: self.groupId,
                app_id: self.appId,
                test_id: self.testId,
                capability_test_id: self.capabilityTestId,
                spec_id: spec.id,
                suite_id: spec.suite.id,
                description: spec.getFullName(),
                png_base64: pngBase64,
                url: currentAppUrl,
                access_key: self.accessKey
              };
              pngBase64 = null;

              request.post(
                'http://' + self.domain + '/screenshot',
                { form: data },
                function (error, response, body) {
                  console.log(body);
                  try {
                    var jsonData = JSON.parse(body);
                    self.totalCompares++;
                    self.totalRMS = self.totalRMS + jsonData.rms;
                    self.highestRMS = Math.max(self.highestRMS, jsonData.rms);
                  } catch(e) {
                    console.error('Error posting screenshot');
                    console.error(e);
                  }

                  var next = self.flow.getSchedule().toString();
                  if(next.indexOf('.quit()') > 0) {
                    self.onComplete(d);
                  } else {
                    d.fulfill();
                  }
                }
              );
            });

          });

        });

      });

      return d.promise;
    });
  };

  IonicReporter.prototype.onComplete = function(d) {
    var self = this;

    var data = {
      duration_ms: Date.now() - self.startTime,
      total_compares: self.totalCompares,
      highest_rms: self.highestRMS,
      rms_average: (self.totalCompares > 0 ? (self.totalRMS / self.totalCompares) : 0),
      access_key: self.accessKey
    };

    if(self.compareResultId) {
      request.post(
        'http://' + self.domain + '/' + self.groupId + '/' + self.appId + '/' + self.testId + '/' + self.compareResultId + '/complete',
        { form: data },
        function (error, response, body) {
          console.log(body);
          try {
            var jsonData = JSON.parse(body);
            if(jsonData.compare_url) {
              var spawn = require('child_process').spawn;
              spawn('open', [jsonData.compare_url]);
            }
          } catch(e) {
            console.error(e);
          }
          d.fulfill();
        }
      );
    } else {
      d.fulfill();
    }
  };

  // get --test_id cmd line argument
  for(var x=0; x<this.process.argv.length;x++) {
    var arg = this.process.argv[x].split('=');
    if(arg.length == 2 && arg[0] == '--test_id') {
      options.testId = arg[1];
    }
  }

  if(!options.testId) {
    console.error('--test_id=XXX cmd line arg w/ unique ID required');
    return;
  }

  this.jasmine.getEnv().addReporter( new IonicReporter(options) );

};

module.exports = IonicSnapshot;
