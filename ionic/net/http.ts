import * as util from 'ionic/util';


//TODO(mlynch): surely, there must be another way, sir?
window._jsonpcallbacks = {
  counter: 0
};

/**
 * The Http class makes it easy to send GET/POST/PUT/DELETE/PATCH requests
 * and send/receive JSON (or anything else) through a simple API.
 *
 * Http uses the `fetch()` API underneath, or a polyfill if it's not natively supported.
 */
export class Http {

  /**
   * The raw fetch() operation.
   *
   * Generally, you want to use one of get()/post()/put()/delete() but
   * this is useful if you want to do something crazy.
   *
   * @param url the URL to pass to fetch
   * @param options the options to configure the fetch
   * @return es6 promise from the fetch.
   */
  static fetch(url, options) {
    return window.fetch(url, options).then((response) => {
      // status "0" to handle local files fetching (e.g. Cordova/Phonegap etc.)
      if (response.status === 200 || response.status === 0) {

        // We have a good response, let's check the response headers and return
        // deserialized JSON or return the text from the response.
        if (response.headers.get('Content-Type') === 'application/json') {
          return response.json();
        }
        return response.text();
      } else {
        return Promise.reject(response, new Error(response.statusText));
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  static jsonp(url, callbackId, options) {
    return new Promise((resolve, reject) => {

      var script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.type = 'text/javascript';

      var callback = (event) => {
        script.removeEventListener('load', callback);
        script.removeEventListener('error', callback);

        document.body.removeChild(script);

        let text, status;
        if(event) {
          if(event.type === "load" && !window._jsonpcallbacks[callbackId].called) {
            event = { type: "error" };
          }
          text = event.type;
          status = event.type === "error" ? 404 : 200;
          resolve(window._jsonpcallbacks[callbackId].data, status, text);
        } else {
          reject();
        }

        /*
        var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
            callbackId, function(status, text) {
          completeRequest(callback, status, callbacks[callbackId].data, "", text);
          callbacks[callbackId] = noop;
        });
        */
      };

      script.addEventListener('load', callback);
      script.addEventListener('error', callback);
      document.body.appendChild(script);
      return callback;

    });
  }

  static _method(method, url, data, options, sendsJson) {
    options = util.defaults(options, {
      method: method,
      headers: {
        'Accept': 'application/json,text/plain,*/*',
      },
    });

    if(options.body) {
      options.body = (typeof data === 'string') ? data : JSON.stringify(data)
    }

    if(sendsJson) {
      options.headers['Content-Type'] = 'application/json';
    }

    if(options.method == 'jsonp') {
      // Adopted from Angular 1
      let callbacks = window._jsonpcallbacks;

      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
        callbacks[callbackId].called = true;
      };


      /*
      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          callbackId, function(status, text) {
        completeRequest(callback, status, callbacks[callbackId].data, "", text);
        callbacks[callbackId] = noop;
      });
      */

      url = url.replace('JSON_CALLBACK', '_jsonpcallbacks.' + callbackId);

      return Http.jsonp(url, callbackId, options);
    } else {
      return Http.fetch(url, options);
    }

  }

  /**
   * Send a GET request to the given URL.
   *
   * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
   *
   * @param url the URL to POST to
   * @param options the options to configure the post with.
   * @return promise
   */
  static get(url, options = {}) {
    return Http._method('get', url, {}, options);
  }

  /**
   * Send a POST request to the given URL.
   *
   * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
   * and the `Content-Type` header as `application/json`
   *
   * @param url the URL to POST to
   * @param options the options to configure the post with.
   * @return promise
   */
  static post(url, data = {}, options = {}) {
    return Http._method('post', url, data, options, true);
  }

  /**
   * Send a PUT request to the given URL.
   *
   * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
   * and the `Content-Type` header as `application/json`
   *
   * @param url the URL to PUT to
   * @param data the JSON data to send
   * @param options the options to configure the post with.
   * @return promise
   */
  static put(url, data = {}, options = {}) {
    return Http._method('put', url, data, options, true);
  }

  /**
   * Send a DELETE request to the given URL.
   *
   * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
   * and the `Content-Type` header as `application/json`
   *
   * @param url the URL to DELETE to
   * @param data the JSON data to send
   * @param options the options to configure the post with.
   * @return promise
   */
  static delete(url, data = {}, options = {}) {
    return Http._method('delete', url, data, options, true);
  }

  /**
   * Send a PATH request to the given URL.
   *
   * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
   * and the `Content-Type` header as `application/json`
   *
   * @param url the URL to PATH to
   * @param options the options to configure the post with.
   * @return promise
   */
  static patch(url, data = {}, options = {}) {
    return Http._method('patch', url, data, options, true);
  }
}
