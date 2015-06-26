import * as util from 'ionic/util';


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
    return fetch(url, options).then((response) => {
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

  static _method(method, url, data, options, sendsJson) {
    options = util.defaults(options, {
      method: method,
      headers: {
        'Accept': 'application/json,text/plain,*/*',
      },
      body: (typeof data === 'string') ? data : JSON.stringify(data)
    });

    if(sendsJson) {
      options.headers['Content-Type'] = 'application/json';
    }

    return Http.fetch(url, options);
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
