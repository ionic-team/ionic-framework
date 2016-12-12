
export class ImgLoader {
  private imgs: ImgData[] = [];

  load(src: string, useCache: boolean, callback: ImgLoadCallback) {
    // see if we already have image data for this src
    let img = this.imgs.find(i => i.src === src);

    if (img && img.datauri && useCache) {
      // we found image data, and it's cool if we use the cache
      // so let's respond with the cached data
      callback(200, null, img.datauri);
      return;
    }

    // so no cached image data, so we'll
    // need to do a new http request

    if (img && img.xhr && img.xhr.readyState !== 4) {
      // looks like there's already an active http request going on
      // for this same source, so let's just add another listener
      img.xhr.addEventListener('load', (xhrEvent) => {
        onXhrLoad(callback, xhrEvent, useCache, img, this.imgs);
      });
      img.xhr.addEventListener('error', (xhrErrorEvent) => {
        onXhrError(callback, img, xhrErrorEvent);
      });
      return;
    }

    if (!img) {
      // no image data yet, so let's create it
      img = { src: src };
      this.imgs.push(img);
    }

    // ok, let's do a full request for the image
    img.xhr = new XMLHttpRequest();
    img.xhr.open('GET', src, true);
    img.xhr.responseType = 'arraybuffer';

    // add the listeners if it loaded or errored
    img.xhr.addEventListener('load', (xhrEvent) => {
      onXhrLoad(callback, xhrEvent, useCache, img, this.imgs);
    });
    img.xhr.addEventListener('error', (xhrErrorEvent) => {
      onXhrError(callback, img, xhrErrorEvent);
    });

    // awesome, let's kick off the request
    img.xhr.send();
  }

  abort(src: string) {
    const img = this.imgs.find(i => i.src === src);
    if (img && img.xhr && img.xhr.readyState !== 4) {
      // we found the image data and there's an active
      // http request, so let's abort the request
      img.xhr.abort();
      img.xhr = null;
    }
  }

}


function onXhrLoad(callback: ImgLoadCallback, ev: any, useCache: boolean, img: ImgData, imgs: ImgData[]) {
  if (!callback) {
    return;
  }

  // the http request has been loaded
  // create a rsp object to send back to the main thread
  const status: number = ev.target.status;
  let datauri: string = null;

  if (status === 200) {
    // success!!
    // now let's convert the response arraybuffer data into a datauri
    datauri = getDataUri(ev.target.getResponseHeader('Content-Type'), ev.target.response);

    if (useCache) {
      // if the image was successfully downloaded
      // and this image is allowed to be cached
      // then let's add it to our image data for later use
      img.datauri = datauri;
      img.len = datauri.length;

      // let's loop through all our cached data and if we go
      // over our limit then let's clean it out a bit
      // oldest data should go first
      var cacheSize = 0;
      for (var i = imgs.length - 1; i >= 0; i--) {
        cacheSize += imgs[i].len;
        if (cacheSize > CACHE_LIMIT) {
          console.debug(`img-loader, clear: ${imgs[i].src}, len: ${imgs[i].len}`);
          imgs.splice(i, 1);
        }
      }
    }
  }

  // fire the callback with what we've learned today
  callback(status, null, datauri);
}


function onXhrError(callback: ImgLoadCallback, imgData: ImgData, err: ErrorEvent) {
  // darn, we got an error!
  callback && callback(0, (err.message || ''), null);
  imgData.xhr = null;
}


function getDataUri(contentType, arrayBuffer): string {
  // take arraybuffer and content type and turn it into
  // a datauri string that can be used by <img>
  const rtn: string[] = ['data:' + contentType + ';base64,'];

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;
  let i, a, b, c, d, chunk;

  for (i = 0; i < mainLength; i = i + 3) {
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    rtn.push(ENCODINGS[a] + ENCODINGS[b] + ENCODINGS[c] + ENCODINGS[d]);
  }

  if (byteRemainder === 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    rtn.push(ENCODINGS[a] + ENCODINGS[b] + '==');

  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    rtn.push(ENCODINGS[a] + ENCODINGS[b] + ENCODINGS[c] + '=');
  }

  return rtn.join('');
}

// used by the setData function
const ENCODINGS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const CACHE_LIMIT = 1381855 * 20;

export interface ImgData {
  src: string;
  datauri?: string;
  len?: number;
  xhr?: XMLHttpRequest;
}

export type ImgLoadCallback = {
  (status: number, msg: string, datauri: string): void;
}
