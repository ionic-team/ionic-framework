(function(){

  var imgs = [];
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var cacheLimit = 1381855 * 10;

  onmessage = function(msg) {
    var msgData = JSON.parse(msg.data);
    var id = msgData.id;
    var src = msgData.src;
    var imgData;

    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].s === src) {
        imgData = imgs[i];
        break;
      }
    }

    if (msgData.type === 'abort') {
      if (imgData && imgData.x) {
        imgData.x.abort();
        imgData.x = null;
      }

    } else if (msgData.cache && imgData && imgData.d) {
      postMessage(JSON.stringify({
        id: id,
        src: src,
        status: 200,
        data: imgData.d,
        len: imgData.l
      }));

    } else {
      if (imgData && imgData.x && imgData.x.readyState !== 4) {
        imgData.x.addEventListener('load', function(ev) {
          onXhrLoad(id, src, imgData, ev);
        });
        imgData.x.addEventListener('error', function(e) {
          onXhrError(id, src, imgData, e);
        });
        return;
      }

      if (!imgData) {
        imgData = { s: src, c: msgData.cache };
        imgs.push(imgData);
      }

      imgData.x = new XMLHttpRequest();
      imgData.x.open('GET', src, true);
      imgData.x.responseType = 'arraybuffer';
      imgData.x.addEventListener('load', function(ev) {
        onXhrLoad(id, src, imgData, ev);
      });
      imgData.x.addEventListener('error', function(e) {
        onXhrError(id, src, imgData, e);
      });
      imgData.x.send();
    }

  };

  function onXhrLoad(id, src, imgData, ev) {
    var rsp = {
      id: id,
      src: src,
      status: ev.target.status,
      data: null,
      len: 0
    };

    if (ev.target.status === 200) {
      setData(rsp, ev.target.getResponseHeader('Content-Type'), ev.target.response);
      rsp.len = rsp.data.length;
    }

    postMessage(JSON.stringify(rsp));

    if (imgData.x.status === 200 && imgData.c) {
      imgData.d = rsp.data;
      imgData.l = rsp.len;

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
    postMessage(JSON.stringify({
      id: id,
      src: src,
      status: 510,
      msg: e.message + '' + e.stack
    }));
    imgData.x = null;
  };


  function setData(rsp, contentType, arrayBuffer) {
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

})();
