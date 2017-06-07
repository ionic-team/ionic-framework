
module.exports = function(options) {

  var fs = require('fs');
  var path = require('path');
  var request = require('request');
  var inputDir = path.join(__dirname, '..', '..' , 'dist', 'e2e', 'tests');
  var uploadQueue = [];

  var ignoreFiles = /(\/test\/|\/ts\/|\/q\/|\/ionic-site\/|\/docs\/|\/examples\/|\/inquirer\/|\/lodash\/|\/tooling\/|\/colors\/|\/bin\/|\.ts$|\.bin|\.map$|\.md$|\.git|\.scss$|\.yml$|\.yaml$|\.dart$|\.txt|\.npm|bower|DS_Store|LICENSE)/i;

  function uploadFiles(dir, urlPath) {
    fs.readdir(dir, function(err, list) {

      list.forEach(function(file) {
        var url = path.join(urlPath, file);


        fs.stat(path.join(dir, file), function(err, stat) {
          if (stat && stat.isDirectory()) {
            uploadFiles(path.join(dir, file), path.join(urlPath, file);
          } else {
            if ( shouldProcessPath (url) ){
              uploadFile(url, path.join(dir, file));
            }
          }
        });

      });

    });

    setTimeout(postNextUpload, 100);
  }

  function uploadFile(archiveFileUrlPath, archiveFileLocalPath) {
    uploadQueue.push({
      url_path: archiveFileUrlPath,
      local_path: archiveFileLocalPath,
      group_id: options.groupId,
      app_id: options.appId,
      test_id: options.testId,
      access_key: process.env.IONIC_SNAPSHOT_KEY
    });
  }

  function postNextUpload() {
    var uploadData = null;

    var totalUploading = 0;

    for (var i = 0; i < uploadQueue.length; i++) {
      if (uploadQueue[i].status === 'uploaded') {
        continue;

      } else if (uploadQueue[i].status === 'uploading') {
        totalUploading++;
        continue;

      } else {
        uploadData = uploadQueue[i];
      }
    }

    if (!uploadData || totalUploading > 20) {
      return;

    } else if (options.verbose) {
      console.log('Uploading: ' + uploadData.url_path);
    }

    uploadData.status = 'uploading';

    request.post({
        uri: 'http://' + options.domain + '/e2e/upload-url',
        formData: uploadData
      },
      function(err, httpResponse, body) {
        if (err) {
          uploadData.status = 'failed';
          console.error('Get upload failed:', uploadData.url_path, err);

        } else {
          if (httpResponse.statusCode == 200) {
            uploadE2E(body, uploadData);
          } else {
            console.error('Get upload error:', httpResponse.statusCode, body);
          }
        }
      }
    );
  }

  function uploadE2E(uploadUrl, uploadData) {
    var formData = {
      file: fs.createReadStream(uploadData.local_path)
    };

    request.post({
        uri: uploadUrl,
        formData: formData
      },
      function(err, httpResponse, body) {
        setTimeout(postNextUpload, 100);

        if (err) {
          console.error('Upload failed:', uploadUrl, err);
          uploadData.status = 'failed';

        } else {
          if (httpResponse.statusCode == 200) {
            uploadData.status = 'uploaded';

            if (options.verbose) {
              console.error('Uploaded:', uploadData.url_path);
            }
          } else {
            console.error('Upload error:', httpResponse.statusCode, body);
            uploadData.status = 'failed';
          }
        }
      }
    );
  }

  function shouldProcessPath(urlPath) {
    if ( urlPath && urlPath.length > 0 ) {
      var cleanedUpString = urlPath.substring(1);
      var tokens = cleanedUpString.split('/');
      // {component}/test/{testName}/{file}
      var extension = path.extname(cleanedUpString);
      return tokens && tokens.length > 3 && tokens[1] === 'test' && ( extension === '.html' || extension === '.js' );
    }
    return false;
  }

  console.log('Uploading e2e tests:', options.testId);
  uploadFiles(inputDir, '');
};
