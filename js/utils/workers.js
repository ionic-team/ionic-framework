(function() {
ionic.workers = {};

// WORKER_SCRIPTS is filled in by the build system with the contents of files from js/workers/
ionic.WORKER_SCRIPTS = {};

// Instantiated ionic worker wrappers
var ionicWorkers = {};
var nextMessageId = 0;

/*
 * IonicWorker objects are returned from `ionic.workers.get(workerName)`.
 * Usage:
 *   var worker = ionic.workers.get('name');
 *   worker.send({ message: 'message' }, function response(ev) {
 *   });
 */
function IonicWorker(worker) {
  var pendingResponses = {};

  function onRespond(id, ev) {
    var callback = pendingResponses[id];
    if (callback) {
      callback(ev);
      delete pendingResponses[id];
    }
  }

  this.send = function(data, callback) {
    var id = data.id || (data.id = nextMessageId++);
    data.baseUrl = (
      location.protocol + '//' +
      location.hostname +
      (location.port?':'+location.port:'') +
      location.pathname
    ).replace(/[^\/]+$/, '');

    worker.postMessage(data);

    if (callback) {
      pendingResponses[id] = callback;
    }
  };

  worker.onmessage = function(ev) {
    onRespond(ev.data.id, ev);
  };
}

ionic.workers.get = function(name) {

  // We lazily find worker support to make sure we only try to detect it after DOMReady
  if (typeof ionic.workers.nativeSupport === 'undefined') {
    // Expose this so we can set it to false during tests. Avoids workers being instantiated during
    // unit tests.
    ionic.workers.nativeSupport = true;
    try {
      new Worker(makeBlobUri(';'));
    } catch(e) {
      ionic.workers.nativeSupport = false;
    }
  }
  if (ionicWorkers[name]) {
    return ionicWorkers[name];
  }
  var script = ionic.WORKER_SCRIPTS[name];
  if (!script) {
    throw new Error('Worker ' + name + ' does not exist! Available workers: ' +
                    Object.keys(ionic.WORKER_SCRIPTS).join(', '));
  }

  //Create a new worker
  var worker;
  if (ionic.workers.nativeSupport) {
    worker = new Worker(makeBlobUri(script));
  } else {
    worker = makeFakeWorker(script);
  }

  return (ionicWorkers[name] = new IonicWorker(worker));
};

function makeFakeWorker(script) {
  // FakeWorker() defines all the variables that our mock worker is going to need
  // We then inject the worker `script` into the end of FakeWorker.toString() and
  // pass it to `new Function()`.
  function FakeWorker() {
    // The contents of `script` can redefine these
    var close = function(){};
    var onerror = function(){};
    var onmessage = function(){};

    // Define the public API for the worker
    var publicWorker = {
      onmessage: function(){}
    };

    // What's in `script` will use postMessage to send us a response
    var postMessage = function(data) {
      publicWorker.onmessage({ data: data });
    };
    publicWorker.postMessage = function(data) {
      onmessage({ data: data });
    };
    publicWorker.terminate = function() {
      close();
    };
  }

  // Inject the contents of `script` into the above FakeWorker function
  var fakeWorkerString = FakeWorker.toString()
    // Get rid of the leading `function FakeWorker() {`
    .replace(/^.*?{/, '')
    // Replace the ending brace with our script in an IIFE, then a return statement
    .replace(/}$/, '(function(){' + script + ';})();\nreturn publicWorker;');

  /* jshint -W054 */
  var fakeWorkerFn = new Function(fakeWorkerString);

  return fakeWorkerFn();
}

function makeBlobUri(script) {
  var URL = window.URL || window.webkitURL;
  var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
  var blob;
  try {
    blob = new Blob([script], { type: 'text/javascript' });
  } catch (e) {
    blob = new BlobBuilder();
    blob.append(script);
    blob = blob.getBlob();
  }
  return URL.createObjectURL(blob);
}

})();
