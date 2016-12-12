(function(){

  // keep a collection of all the
  // cached images and current image requests
  var imgs = [];

  // set the cache limit, about 20MB
  var cacheLimit = 1381855 * 20;

  onmessage = function(msg) {
    // received a message from the main thread
    // message was a string, JSON parse it
    var msgData = JSON.parse(msg.data);
    var id = msgData.id;
    var src = msgData.src;
    var imgData;

    // see if we already have image data for this src
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].s === src) {
        // found existing image data
        imgData = imgs[i];
        break;
      }
    }

    if (msgData.type === 'abort') {
      // this message was to abort this src
      if (imgData && imgData.x) {
        // we found the image data and there's
        // an active request, so let's abort it
        imgData.x.abort();
        imgData.x = null;
      }

    } else if (msgData.cache && imgData && imgData.d) {
      // we found image data, and it's cool if we use the cache
      // so let's respond to the main thread with the cached data
      postMessage(JSON.stringify({
        id: id,
        src: src,
        status: 200,
        data: imgData.d,
        len: imgData.l
      }));

    } else {
      // we need to do a full http request

      if (imgData && imgData.x && imgData.x.readyState !== 4) {
        // looks like there's already an active http request
        // for this same source, so let's just add another listener
        imgData.x.addEventListener('load', function(ev) {
          onXhrLoad(id, src, imgData, ev);
        });
        imgData.x.addEventListener('error', function(e) {
          onXhrError(id, src, imgData, e);
        });
        return;
      }

      if (!imgData) {
        // no image data yet, so let's create it
        imgData = { s: src, c: msgData.cache };
        imgs.push(imgData);
      }

      // ok, let's do a full request for the image
      imgData.x = new XMLHttpRequest();
      imgData.x.open('GET', src, true);
      imgData.x.responseType = 'arraybuffer';

      // add the listeners if it loaded or errored
      imgData.x.addEventListener('load', function(ev) {
        onXhrLoad(id, src, imgData, ev);
      });
      imgData.x.addEventListener('error', function(e) {
        onXhrError(id, src, imgData, e);
      });

      // awesome, let's kick off the request
      imgData.x.send();
    }

  };

  function onXhrLoad(id, src, imgData, ev) {
    // the http request has been loaded
    // create a rsp object to send back to the main thread
    var rsp = {
      id: id,
      src: src,
      status: ev.target.status,
      data: null,
      len: 0
    };

    if (ev.target.status === 200) {
      // success!!
      // now let's convert the response arraybuffer data into a datauri
      setData(rsp, ev.target.getResponseHeader('Content-Type'), ev.target.response);
      rsp.len = rsp.data.length;
    }

    // post back to the main thread what we've learned today
    postMessage(JSON.stringify(rsp));

    if (imgData.x.status === 200 && imgData.c) {
      // if the image was successfully downloaded
      // and this image is allowed to be cached
      // then let's add it to our image data for later use
      imgData.d = rsp.data;
      imgData.l = rsp.len;

      // let's loop through all our cached data and if we go
      // over our limit then let's clean it out a bit
      // oldest data should go first
      var cacheSize = 0;
      for (var i = imgs.length - 1; i >= 0; i--) {
        cacheSize += imgs[i].l;
        if (cacheSize > cacheLimit) {
          imgs.splice(i, 1);
        }
      }
    }
  };

  function onXhrError(id, src, imgData, e) {
    // darn, we got an error!
    postMessage(JSON.stringify({
      id: id,
      src: src,
      status: 0,
      msg: (e.message || '')
    }));
    imgData.x = null;
  };


  function setData(rsp, contentType, arrayBuffer) {
    // take arraybuffer and content type and turn it into
    // a datauri string that we can pass back to the main thread
    rsp.data = 'data:' + contentType + ';base64,';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var i, a, b, c, d, chunk;

    for (i = 0; i < mainLength; i = i + 3) {
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      a = (chunk & 16515072) >> 18;
      b = (chunk & 258048) >> 12;
      c = (chunk & 4032) >> 6;
      d = chunk & 63;
      rsp.data += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    if (byteRemainder === 1) {
      chunk = bytes[mainLength];
      a = (chunk & 252) >> 2;
      b = (chunk & 3) << 4;
      rsp.data += encodings[a] + encodings[b] + '==';

    } else if (byteRemainder === 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
      a = (chunk & 64512) >> 10;
      b = (chunk & 1008) >> 4;
      c = (chunk & 15) << 2;
      rsp.data += encodings[a] + encodings[b] + encodings[c] + '=';
    }
  }

  // used the setData function
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

})();
