import { removeArrayItem } from '../../util/util';


export class ImgLoader {
  private wkr: Worker;
  private callbacks: Function[] = [];
  private ids = 0;

  load(src: string, cache: boolean, callback: Function) {
    if (src) {
      (<any>callback).id = this.ids++;
      this.callbacks.push(callback);
      this.worker().postMessage(JSON.stringify({
        id: (<any>callback).id,
        src: src,
        cache: cache
      }));
    }
  }

  cancelLoad(callback: Function) {
    removeArrayItem(this.callbacks, callback);
  }

  abort(src: string) {
    if (src) {
      this.worker().postMessage(JSON.stringify({
        src: src,
        type: 'abort'
      }));
    }
  }

  private worker() {
    if (!this.wkr) {
      // create a blob from the inline worker string
      const workerBlob = new Blob([INLINE_WORKER]);

      // obtain a blob URL reference to our worker 'file'.
      const blobURL = window.URL.createObjectURL(workerBlob);

      // create the worker
      this.wkr = new Worker(blobURL);

      // create worker onmessage handler
      this.wkr.onmessage = (ev: MessageEvent) => {
        // we got something back from the web worker
        // let's emit this out to everyone listening
        const msg: ImgResponseMessage = JSON.parse(ev.data);
        const callback = this.callbacks.find(cb => (<any>cb).id === msg.id);
        if (callback) {
          callback(msg);
          removeArrayItem(this.callbacks, callback);
        }
      };

      // create worker onerror handler
      this.wkr.onerror = (ev: ErrorEvent) => {
        console.error(`ImgLoader, worker ${ev.type} ${ev.message ? ev.message : ''}`);
        this.callbacks.length = 0;
        this.wkr.terminate();
        this.wkr = null;
      };
    }

    // return that hard worker
    return this.wkr;
  }

}


const INLINE_WORKER = `/** minify-start **/

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

/** minify-end **/`;


export interface ImgResponseMessage {
  id: number;
  src: string;
  status?: number;
  data?: string;
  msg?: string;
}
