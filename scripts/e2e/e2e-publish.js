
module.exports = function(options) {

  var fs = require('fs');
  var path = require('path');
  var request = require('request');
  var inputDir = path.join(__dirname, '../../dist');


  function uploadFiles(dir, urlPath) {
    fs.readdir(dir, function(err, list) {

      list.forEach(function(file) {
        var url = urlPath + '/' + file

        if (url.indexOf('/test/') > -1) return;

        fs.stat(dir + '/' + file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            uploadFiles(dir + '/' + file, urlPath + '/' + file);
          } else {
            uploadFile(url, dir + '/' + file);
          }
        });

      });

    });
  }

  function uploadFile(archiveFileUrlPath, archiveFileLocalPath) {
    var formData = {
      url_path: archiveFileUrlPath,
      group_id: options.groupId,
      app_id: options.appId,
      test_id: options.testId,
      access_key: process.env.IONIC_SNAPSHOT_KEY
    };

    request.post({
        uri: 'http://' + options.domain + '/e2e/upload-url',
        formData: formData
      },
      function(err, httpResponse, body) {
        if (err) {
          console.error('Get upload failed:', err);
        } else {
          if (httpResponse.statusCode == 200) {
            uploadE2E(body, archiveFileUrlPath, archiveFileLocalPath);
          } else {
            console.error('Get upload error:', httpResponse.statusCode, body);
          }
        }
      }
    );
  }

  function uploadE2E(uploadUrl, archiveFileUrlPath, archiveFileLocalPath) {
    var formData = {
      file: fs.createReadStream(archiveFileLocalPath)
    };

    request.post({
        uri: uploadUrl,
        formData: formData
      },
      function(err, httpResponse, body) {
        if (err) {
          console.error('Upload failed:', err);
        } else {
          if (httpResponse.statusCode != 200) {
            console.error('Upload error:', httpResponse.statusCode, body);
          }
        }
      }
    );
  }

  console.log('Uploading e2e tests:', options.testId);
  uploadFiles(inputDir, '');
};
