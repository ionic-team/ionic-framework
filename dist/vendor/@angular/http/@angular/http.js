/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { Injectable, NgModule, Version } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ɵgetDOM } from '@angular/platform-browser';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A backend for http that uses the `XMLHttpRequest` browser API.
 *
 * Take care not to evaluate this in non-browser contexts.
 *
 * \@experimental
 */
class BrowserXhr {
    constructor() { }
    /**
     * @return {?}
     */
    build() { return ((new XMLHttpRequest())); }
}
BrowserXhr.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
BrowserXhr.ctorParameters = () => [];

let RequestMethod = {};
RequestMethod.Get = 0;
RequestMethod.Post = 1;
RequestMethod.Put = 2;
RequestMethod.Delete = 3;
RequestMethod.Options = 4;
RequestMethod.Head = 5;
RequestMethod.Patch = 6;
RequestMethod[RequestMethod.Get] = "Get";
RequestMethod[RequestMethod.Post] = "Post";
RequestMethod[RequestMethod.Put] = "Put";
RequestMethod[RequestMethod.Delete] = "Delete";
RequestMethod[RequestMethod.Options] = "Options";
RequestMethod[RequestMethod.Head] = "Head";
RequestMethod[RequestMethod.Patch] = "Patch";
let ReadyState = {};
ReadyState.Unsent = 0;
ReadyState.Open = 1;
ReadyState.HeadersReceived = 2;
ReadyState.Loading = 3;
ReadyState.Done = 4;
ReadyState.Cancelled = 5;
ReadyState[ReadyState.Unsent] = "Unsent";
ReadyState[ReadyState.Open] = "Open";
ReadyState[ReadyState.HeadersReceived] = "HeadersReceived";
ReadyState[ReadyState.Loading] = "Loading";
ReadyState[ReadyState.Done] = "Done";
ReadyState[ReadyState.Cancelled] = "Cancelled";
let ResponseType = {};
ResponseType.Basic = 0;
ResponseType.Cors = 1;
ResponseType.Default = 2;
ResponseType.Error = 3;
ResponseType.Opaque = 4;
ResponseType[ResponseType.Basic] = "Basic";
ResponseType[ResponseType.Cors] = "Cors";
ResponseType[ResponseType.Default] = "Default";
ResponseType[ResponseType.Error] = "Error";
ResponseType[ResponseType.Opaque] = "Opaque";
let ContentType = {};
ContentType.NONE = 0;
ContentType.JSON = 1;
ContentType.FORM = 2;
ContentType.FORM_DATA = 3;
ContentType.TEXT = 4;
ContentType.BLOB = 5;
ContentType.ARRAY_BUFFER = 6;
ContentType[ContentType.NONE] = "NONE";
ContentType[ContentType.JSON] = "JSON";
ContentType[ContentType.FORM] = "FORM";
ContentType[ContentType.FORM_DATA] = "FORM_DATA";
ContentType[ContentType.TEXT] = "TEXT";
ContentType[ContentType.BLOB] = "BLOB";
ContentType[ContentType.ARRAY_BUFFER] = "ARRAY_BUFFER";
let ResponseContentType = {};
ResponseContentType.Text = 0;
ResponseContentType.Json = 1;
ResponseContentType.ArrayBuffer = 2;
ResponseContentType.Blob = 3;
ResponseContentType[ResponseContentType.Text] = "Text";
ResponseContentType[ResponseContentType.Json] = "Json";
ResponseContentType[ResponseContentType.ArrayBuffer] = "ArrayBuffer";
ResponseContentType[ResponseContentType.Blob] = "Blob";

/**
 * Polyfill for [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers), as
 * specified in the [Fetch Spec](https://fetch.spec.whatwg.org/#headers-class).
 *
 * The only known difference between this `Headers` implementation and the spec is the
 * lack of an `entries` method.
 *
 * ### Example
 *
 * ```
 * import {Headers} from '\@angular/http';
 *
 * var firstHeaders = new Headers();
 * firstHeaders.append('Content-Type', 'image/jpeg');
 * console.log(firstHeaders.get('Content-Type')) //'image/jpeg'
 *
 * // Create headers from Plain Old JavaScript Object
 * var secondHeaders = new Headers({
 *   'X-My-Custom-Header': 'Angular'
 * });
 * console.log(secondHeaders.get('X-My-Custom-Header')); //'Angular'
 *
 * var thirdHeaders = new Headers(secondHeaders);
 * console.log(thirdHeaders.get('X-My-Custom-Header')); //'Angular'
 * ```
 *
 * \@experimental
 */
class Headers {
    /**
     * @param {?=} headers
     */
    constructor(headers) {
        /**
         * \@internal header names are lower case
         */
        this._headers = new Map();
        /**
         * \@internal map lower case names to actual names
         */
        this._normalizedNames = new Map();
        if (!headers) {
            return;
        }
        if (headers instanceof Headers) {
            headers.forEach((values, name) => {
                values.forEach(value => this.append(name, value));
            });
            return;
        }
        Object.keys(headers).forEach((name) => {
            const values = Array.isArray(headers[name]) ? headers[name] : [headers[name]];
            this.delete(name);
            values.forEach(value => this.append(name, value));
        });
    }
    /**
     * Returns a new Headers instance from the given DOMString of Response Headers
     * @param {?} headersString
     * @return {?}
     */
    static fromResponseHeaderString(headersString) {
        const /** @type {?} */ headers = new Headers();
        headersString.split('\n').forEach(line => {
            const /** @type {?} */ index = line.indexOf(':');
            if (index > 0) {
                const /** @type {?} */ name = line.slice(0, index);
                const /** @type {?} */ value = line.slice(index + 1).trim();
                headers.set(name, value);
            }
        });
        return headers;
    }
    /**
     * Appends a header to existing list of header values for a given header name.
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    append(name, value) {
        const /** @type {?} */ values = this.getAll(name);
        if (values === null) {
            this.set(name, value);
        }
        else {
            values.push(value);
        }
    }
    /**
     * Deletes all header values for the given name.
     * @param {?} name
     * @return {?}
     */
    delete(name) {
        const /** @type {?} */ lcName = name.toLowerCase();
        this._normalizedNames.delete(lcName);
        this._headers.delete(lcName);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    forEach(fn) {
        this._headers.forEach((values, lcName) => fn(values, this._normalizedNames.get(lcName), this._headers));
    }
    /**
     * Returns first header that matches given name.
     * @param {?} name
     * @return {?}
     */
    get(name) {
        const /** @type {?} */ values = this.getAll(name);
        if (values === null) {
            return null;
        }
        return values.length > 0 ? values[0] : null;
    }
    /**
     * Checks for existence of header by given name.
     * @param {?} name
     * @return {?}
     */
    has(name) { return this._headers.has(name.toLowerCase()); }
    /**
     * Returns the names of the headers
     * @return {?}
     */
    keys() { return Array.from(this._normalizedNames.values()); }
    /**
     * Sets or overrides header value for given name.
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    set(name, value) {
        if (Array.isArray(value)) {
            if (value.length) {
                this._headers.set(name.toLowerCase(), [value.join(',')]);
            }
        }
        else {
            this._headers.set(name.toLowerCase(), [value]);
        }
        this.mayBeSetNormalizedName(name);
    }
    /**
     * Returns values of all headers.
     * @return {?}
     */
    values() { return Array.from(this._headers.values()); }
    /**
     * @return {?}
     */
    toJSON() {
        const /** @type {?} */ serialized = {};
        this._headers.forEach((values, name) => {
            const /** @type {?} */ split = [];
            values.forEach(v => split.push(...v.split(',')));
            serialized[((this._normalizedNames.get(name)))] = split;
        });
        return serialized;
    }
    /**
     * Returns list of header values for a given name.
     * @param {?} name
     * @return {?}
     */
    getAll(name) {
        return this.has(name) ? this._headers.get(name.toLowerCase()) || null : null;
    }
    /**
     * This method is not implemented.
     * @return {?}
     */
    entries() { throw new Error('"entries" method is not implemented on Headers class'); }
    /**
     * @param {?} name
     * @return {?}
     */
    mayBeSetNormalizedName(name) {
        const /** @type {?} */ lcName = name.toLowerCase();
        if (!this._normalizedNames.has(lcName)) {
            this._normalizedNames.set(lcName, name);
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates a response options object to be optionally provided when instantiating a
 * {\@link Response}.
 *
 * This class is based on the `ResponseInit` description in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#responseinit).
 *
 * All values are null by default. Typical defaults can be found in the
 * {\@link BaseResponseOptions} class, which sub-classes `ResponseOptions`.
 *
 * This class may be used in tests to build {\@link Response Responses} for
 * mock responses (see {\@link MockBackend}).
 *
 * ### Example ([live demo](http://plnkr.co/edit/P9Jkk8e8cz6NVzbcxEsD?p=preview))
 *
 * ```typescript
 * import {ResponseOptions, Response} from '\@angular/http';
 *
 * var options = new ResponseOptions({
 *   body: '{"name":"Jeff"}'
 * });
 * var res = new Response(options);
 *
 * console.log('res.json():', res.json()); // Object {name: "Jeff"}
 * ```
 *
 * \@experimental
 */
class ResponseOptions {
    /**
     * @param {?=} __0
     */
    constructor({ body, status, headers, statusText, type, url } = {}) {
        this.body = body != null ? body : null;
        this.status = status != null ? status : null;
        this.headers = headers != null ? headers : null;
        this.statusText = statusText != null ? statusText : null;
        this.type = type != null ? type : null;
        this.url = url != null ? url : null;
    }
    /**
     * Creates a copy of the `ResponseOptions` instance, using the optional input as values to
     * override
     * existing values. This method will not change the values of the instance on which it is being
     * called.
     *
     * This may be useful when sharing a base `ResponseOptions` object inside tests,
     * where certain properties may change from test to test.
     *
     * ### Example ([live demo](http://plnkr.co/edit/1lXquqFfgduTFBWjNoRE?p=preview))
     *
     * ```typescript
     * import {ResponseOptions, Response} from '\@angular/http';
     *
     * var options = new ResponseOptions({
     *   body: {name: 'Jeff'}
     * });
     * var res = new Response(options.merge({
     *   url: 'https://google.com'
     * }));
     * console.log('options.url:', options.url); // null
     * console.log('res.json():', res.json()); // Object {name: "Jeff"}
     * console.log('res.url:', res.url); // https://google.com
     * ```
     * @param {?=} options
     * @return {?}
     */
    merge(options) {
        return new ResponseOptions({
            body: options && options.body != null ? options.body : this.body,
            status: options && options.status != null ? options.status : this.status,
            headers: options && options.headers != null ? options.headers : this.headers,
            statusText: options && options.statusText != null ? options.statusText : this.statusText,
            type: options && options.type != null ? options.type : this.type,
            url: options && options.url != null ? options.url : this.url,
        });
    }
}
/**
 * Subclass of {\@link ResponseOptions}, with default values.
 *
 * Default values:
 *  * status: 200
 *  * headers: empty {\@link Headers} object
 *
 * This class could be extended and bound to the {\@link ResponseOptions} class
 * when configuring an {\@link Injector}, in order to override the default options
 * used by {\@link Http} to create {\@link Response Responses}.
 *
 * ### Example ([live demo](http://plnkr.co/edit/qv8DLT?p=preview))
 *
 * ```typescript
 * import {provide} from '\@angular/core';
 * import {bootstrap} from '\@angular/platform-browser/browser';
 * import {HTTP_PROVIDERS, Headers, Http, BaseResponseOptions, ResponseOptions} from
 * '\@angular/http';
 * import {App} from './myapp';
 *
 * class MyOptions extends BaseResponseOptions {
 *   headers:Headers = new Headers({network: 'github'});
 * }
 *
 * bootstrap(App, [HTTP_PROVIDERS, {provide: ResponseOptions, useClass: MyOptions}]);
 * ```
 *
 * The options could also be extended when manually creating a {\@link Response}
 * object.
 *
 * ### Example ([live demo](http://plnkr.co/edit/VngosOWiaExEtbstDoix?p=preview))
 *
 * ```
 * import {BaseResponseOptions, Response} from '\@angular/http';
 *
 * var options = new BaseResponseOptions();
 * var res = new Response(options.merge({
 *   body: 'Angular',
 *   headers: new Headers({framework: 'angular'})
 * }));
 * console.log('res.headers.get("framework"):', res.headers.get('framework')); // angular
 * console.log('res.text():', res.text()); // Angular;
 * ```
 *
 * \@experimental
 */
class BaseResponseOptions extends ResponseOptions {
    constructor() {
        super({ status: 200, statusText: 'Ok', type: ResponseType.Default, headers: new Headers() });
    }
}
BaseResponseOptions.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
BaseResponseOptions.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {\@link Request}.
 *
 * \@experimental
 * @abstract
 */
class ConnectionBackend {
    /**
     * @abstract
     * @param {?} request
     * @return {?}
     */
    createConnection(request) { }
}
/**
 * Abstract class from which real connections are derived.
 *
 * \@experimental
 * @abstract
 */
class Connection {
}
/**
 * An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
 *
 * \@experimental
 * @abstract
 */
class XSRFStrategy {
    /**
     * @abstract
     * @param {?} req
     * @return {?}
     */
    configureRequest(req) { }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} method
 * @return {?}
 */
function normalizeMethodName(method) {
    if (typeof method !== 'string')
        return method;
    switch (method.toUpperCase()) {
        case 'GET':
            return RequestMethod.Get;
        case 'POST':
            return RequestMethod.Post;
        case 'PUT':
            return RequestMethod.Put;
        case 'DELETE':
            return RequestMethod.Delete;
        case 'OPTIONS':
            return RequestMethod.Options;
        case 'HEAD':
            return RequestMethod.Head;
        case 'PATCH':
            return RequestMethod.Patch;
    }
    throw new Error(`Invalid request method. The method "${method}" is not supported.`);
}
const isSuccess = (status) => (status >= 200 && status < 300);
/**
 * @param {?} xhr
 * @return {?}
 */
function getResponseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return null;
}
/**
 * @param {?} input
 * @return {?}
 */

/**
 * @param {?} input
 * @return {?}
 */
function stringToArrayBuffer(input) {
    const /** @type {?} */ view = new Uint16Array(input.length);
    for (let /** @type {?} */ i = 0, /** @type {?} */ strLen = input.length; i < strLen; i++) {
        view[i] = input.charCodeAt(i);
    }
    return view.buffer;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 * @param {?=} rawParams
 * @return {?}
 */
function paramParser(rawParams = '') {
    const /** @type {?} */ map = new Map();
    if (rawParams.length > 0) {
        const /** @type {?} */ params = rawParams.split('&');
        params.forEach((param) => {
            const /** @type {?} */ eqIdx = param.indexOf('=');
            const [key, val] = eqIdx == -1 ? [param, ''] : [param.slice(0, eqIdx), param.slice(eqIdx + 1)];
            const /** @type {?} */ list = map.get(key) || [];
            list.push(val);
            map.set(key, list);
        });
    }
    return map;
}
/**
 * \@experimental
 *
 */
class QueryEncoder {
    /**
     * @param {?} k
     * @return {?}
     */
    encodeKey(k) { return standardEncoding(k); }
    /**
     * @param {?} v
     * @return {?}
     */
    encodeValue(v) { return standardEncoding(v); }
}
/**
 * @param {?} v
 * @return {?}
 */
function standardEncoding(v) {
    return encodeURIComponent(v)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/gi, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%2B/gi, '+')
        .replace(/%3D/gi, '=')
        .replace(/%3F/gi, '?')
        .replace(/%2F/gi, '/');
}
/**
 * Map-like representation of url search parameters, based on
 * [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) in the url living standard,
 * with several extensions for merging URLSearchParams objects:
 *   - setAll()
 *   - appendAll()
 *   - replaceAll()
 *
 * This class accepts an optional second parameter of ${\@link QueryEncoder},
 * which is used to serialize parameters before making a request. By default,
 * `QueryEncoder` encodes keys and values of parameters using `encodeURIComponent`,
 * and then un-encodes certain characters that are allowed to be part of the query
 * according to IETF RFC 3986: https://tools.ietf.org/html/rfc3986.
 *
 * These are the characters that are not encoded: `! $ \' ( ) * + , ; A 9 - . _ ~ ? /`
 *
 * If the set of allowed query characters is not acceptable for a particular backend,
 * `QueryEncoder` can be subclassed and provided as the 2nd argument to URLSearchParams.
 *
 * ```
 * import {URLSearchParams, QueryEncoder} from '\@angular/http';
 * class MyQueryEncoder extends QueryEncoder {
 *   encodeKey(k: string): string {
 *     return myEncodingFunction(k);
 *   }
 *
 *   encodeValue(v: string): string {
 *     return myEncodingFunction(v);
 *   }
 * }
 *
 * let params = new URLSearchParams('', new MyQueryEncoder());
 * ```
 * \@experimental
 */
class URLSearchParams {
    /**
     * @param {?=} rawParams
     * @param {?=} queryEncoder
     */
    constructor(rawParams = '', queryEncoder = new QueryEncoder()) {
        this.rawParams = rawParams;
        this.queryEncoder = queryEncoder;
        this.paramsMap = paramParser(rawParams);
    }
    /**
     * @return {?}
     */
    clone() {
        const /** @type {?} */ clone = new URLSearchParams('', this.queryEncoder);
        clone.appendAll(this);
        return clone;
    }
    /**
     * @param {?} param
     * @return {?}
     */
    has(param) { return this.paramsMap.has(param); }
    /**
     * @param {?} param
     * @return {?}
     */
    get(param) {
        const /** @type {?} */ storedParam = this.paramsMap.get(param);
        return Array.isArray(storedParam) ? storedParam[0] : null;
    }
    /**
     * @param {?} param
     * @return {?}
     */
    getAll(param) { return this.paramsMap.get(param) || []; }
    /**
     * @param {?} param
     * @param {?} val
     * @return {?}
     */
    set(param, val) {
        if (val === void 0 || val === null) {
            this.delete(param);
            return;
        }
        const /** @type {?} */ list = this.paramsMap.get(param) || [];
        list.length = 0;
        list.push(val);
        this.paramsMap.set(param, list);
    }
    /**
     * @param {?} searchParams
     * @return {?}
     */
    setAll(searchParams) {
        searchParams.paramsMap.forEach((value, param) => {
            const /** @type {?} */ list = this.paramsMap.get(param) || [];
            list.length = 0;
            list.push(value[0]);
            this.paramsMap.set(param, list);
        });
    }
    /**
     * @param {?} param
     * @param {?} val
     * @return {?}
     */
    append(param, val) {
        if (val === void 0 || val === null)
            return;
        const /** @type {?} */ list = this.paramsMap.get(param) || [];
        list.push(val);
        this.paramsMap.set(param, list);
    }
    /**
     * @param {?} searchParams
     * @return {?}
     */
    appendAll(searchParams) {
        searchParams.paramsMap.forEach((value, param) => {
            const /** @type {?} */ list = this.paramsMap.get(param) || [];
            for (let /** @type {?} */ i = 0; i < value.length; ++i) {
                list.push(value[i]);
            }
            this.paramsMap.set(param, list);
        });
    }
    /**
     * @param {?} searchParams
     * @return {?}
     */
    replaceAll(searchParams) {
        searchParams.paramsMap.forEach((value, param) => {
            const /** @type {?} */ list = this.paramsMap.get(param) || [];
            list.length = 0;
            for (let /** @type {?} */ i = 0; i < value.length; ++i) {
                list.push(value[i]);
            }
            this.paramsMap.set(param, list);
        });
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ paramsList = [];
        this.paramsMap.forEach((values, k) => {
            values.forEach(v => paramsList.push(this.queryEncoder.encodeKey(k) + '=' + this.queryEncoder.encodeValue(v)));
        });
        return paramsList.join('&');
    }
    /**
     * @param {?} param
     * @return {?}
     */
    delete(param) { this.paramsMap.delete(param); }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * HTTP request body used by both {\@link Request} and {\@link Response}
 * https://fetch.spec.whatwg.org/#body
 * @abstract
 */
class Body {
    /**
     * Attempts to return body as parsed `JSON` object, or raises an exception.
     * @return {?}
     */
    json() {
        if (typeof this._body === 'string') {
            return JSON.parse(/** @type {?} */ (this._body));
        }
        if (this._body instanceof ArrayBuffer) {
            return JSON.parse(this.text());
        }
        return this._body;
    }
    /**
     * Returns the body as a string, presuming `toString()` can be called on the response body.
     *
     * When decoding an `ArrayBuffer`, the optional `encodingHint` parameter determines how the
     * bytes in the buffer will be interpreted. Valid values are:
     *
     * - `legacy` - incorrectly interpret the bytes as UTF-16 (technically, UCS-2). Only characters
     *   in the Basic Multilingual Plane are supported, surrogate pairs are not handled correctly.
     *   In addition, the endianness of the 16-bit octet pairs in the `ArrayBuffer` is not taken
     *   into consideration. This is the default behavior to avoid breaking apps, but should be
     *   considered deprecated.
     *
     * - `iso-8859` - interpret the bytes as ISO-8859 (which can be used for ASCII encoded text).
     * @param {?=} encodingHint
     * @return {?}
     */
    text(encodingHint = 'legacy') {
        if (this._body instanceof URLSearchParams) {
            return this._body.toString();
        }
        if (this._body instanceof ArrayBuffer) {
            switch (encodingHint) {
                case 'legacy':
                    return String.fromCharCode.apply(null, new Uint16Array(/** @type {?} */ (this._body)));
                case 'iso-8859':
                    return String.fromCharCode.apply(null, new Uint8Array(/** @type {?} */ (this._body)));
                default:
                    throw new Error(`Invalid value for encodingHint: ${encodingHint}`);
            }
        }
        if (this._body == null) {
            return '';
        }
        if (typeof this._body === 'object') {
            return JSON.stringify(this._body, null, 2);
        }
        return this._body.toString();
    }
    /**
     * Return the body as an ArrayBuffer
     * @return {?}
     */
    arrayBuffer() {
        if (this._body instanceof ArrayBuffer) {
            return (this._body);
        }
        return stringToArrayBuffer(this.text());
    }
    /**
     * Returns the request's body as a Blob, assuming that body exists.
     * @return {?}
     */
    blob() {
        if (this._body instanceof Blob) {
            return (this._body);
        }
        if (this._body instanceof ArrayBuffer) {
            return new Blob([this._body]);
        }
        throw new Error('The request body isn\'t either a blob or an array buffer');
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates `Response` instances from provided values.
 *
 * Though this object isn't
 * usually instantiated by end-users, it is the primary object interacted with when it comes time to
 * add data to a view.
 *
 * ### Example
 *
 * ```
 * http.request('my-friends.txt').subscribe(response => this.friends = response.text());
 * ```
 *
 * The Response's interface is inspired by the Response constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#response-class), but is considered a static value whose body
 * can be accessed many times. There are other differences in the implementation, but this is the
 * most significant.
 *
 * \@experimental
 */
class Response extends Body {
    /**
     * @param {?} responseOptions
     */
    constructor(responseOptions) {
        super();
        this._body = responseOptions.body;
        this.status = responseOptions.status;
        this.ok = (this.status >= 200 && this.status <= 299);
        this.statusText = responseOptions.statusText;
        this.headers = responseOptions.headers;
        this.type = responseOptions.type;
        this.url = responseOptions.url;
    }
    /**
     * @return {?}
     */
    toString() {
        return `Response with status: ${this.status} ${this.statusText} for URL: ${this.url}`;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let _nextRequestId = 0;
const JSONP_HOME = '__ng_jsonp__';
let _jsonpConnections = null;
/**
 * @return {?}
 */
function _getJsonpConnections() {
    const /** @type {?} */ w = typeof window == 'object' ? window : {};
    if (_jsonpConnections === null) {
        _jsonpConnections = w[JSONP_HOME] = {};
    }
    return _jsonpConnections;
}
class BrowserJsonp {
    /**
     * @param {?} url
     * @return {?}
     */
    build(url) {
        const /** @type {?} */ node = document.createElement('script');
        node.src = url;
        return node;
    }
    /**
     * @return {?}
     */
    nextRequestID() { return `__req${_nextRequestId++}`; }
    /**
     * @param {?} id
     * @return {?}
     */
    requestCallback(id) { return `${JSONP_HOME}.${id}.finished`; }
    /**
     * @param {?} id
     * @param {?} connection
     * @return {?}
     */
    exposeConnection(id, connection) {
        const /** @type {?} */ connections = _getJsonpConnections();
        connections[id] = connection;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    removeConnection(id) {
        const /** @type {?} */ connections = _getJsonpConnections();
        connections[id] = null;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    send(node) { document.body.appendChild(/** @type {?} */ ((node))); }
    /**
     * @param {?} node
     * @return {?}
     */
    cleanup(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(/** @type {?} */ ((node)));
        }
    }
}
BrowserJsonp.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
BrowserJsonp.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
const JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
/**
 * Abstract base class for an in-flight JSONP request.
 *
 * \@experimental
 * @abstract
 */
class JSONPConnection {
    /**
     * Callback called when the JSONP request completes, to notify the application
     * of the new data.
     * @abstract
     * @param {?=} data
     * @return {?}
     */
    finished(data) { }
}
class JSONPConnection_ extends JSONPConnection {
    /**
     * @param {?} req
     * @param {?} _dom
     * @param {?=} baseResponseOptions
     */
    constructor(req, _dom, baseResponseOptions) {
        super();
        this._dom = _dom;
        this.baseResponseOptions = baseResponseOptions;
        this._finished = false;
        if (req.method !== RequestMethod.Get) {
            throw new TypeError(JSONP_ERR_WRONG_METHOD);
        }
        this.request = req;
        this.response = new Observable((responseObserver) => {
            this.readyState = ReadyState.Loading;
            const id = this._id = _dom.nextRequestID();
            _dom.exposeConnection(id, this);
            // Workaround Dart
            // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
            const callback = _dom.requestCallback(this._id);
            let url = req.url;
            if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                url = url.replace('=JSONP_CALLBACK&', `=${callback}&`);
            }
            else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + `=${callback}`;
            }
            const script = this._script = _dom.build(url);
            const onLoad = (event) => {
                if (this.readyState === ReadyState.Cancelled)
                    return;
                this.readyState = ReadyState.Done;
                _dom.cleanup(script);
                if (!this._finished) {
                    let responseOptions = new ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: ResponseType.Error, url });
                    if (baseResponseOptions) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    responseObserver.error(new Response(responseOptions));
                    return;
                }
                let responseOptions = new ResponseOptions({ body: this._responseData, url });
                if (this.baseResponseOptions) {
                    responseOptions = this.baseResponseOptions.merge(responseOptions);
                }
                responseObserver.next(new Response(responseOptions));
                responseObserver.complete();
            };
            const onError = (error) => {
                if (this.readyState === ReadyState.Cancelled)
                    return;
                this.readyState = ReadyState.Done;
                _dom.cleanup(script);
                let responseOptions = new ResponseOptions({ body: error.message, type: ResponseType.Error });
                if (baseResponseOptions) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new Response(responseOptions));
            };
            script.addEventListener('load', onLoad);
            script.addEventListener('error', onError);
            _dom.send(script);
            return () => {
                this.readyState = ReadyState.Cancelled;
                script.removeEventListener('load', onLoad);
                script.removeEventListener('error', onError);
                this._dom.cleanup(script);
            };
        });
    }
    /**
     * @param {?=} data
     * @return {?}
     */
    finished(data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === ReadyState.Cancelled)
            return;
        this._responseData = data;
    }
}
/**
 * A {\@link ConnectionBackend} that uses the JSONP strategy of making requests.
 *
 * \@experimental
 * @abstract
 */
class JSONPBackend extends ConnectionBackend {
}
class JSONPBackend_ extends JSONPBackend {
    /**
     * @param {?} _browserJSONP
     * @param {?} _baseResponseOptions
     */
    constructor(_browserJSONP, _baseResponseOptions) {
        super();
        this._browserJSONP = _browserJSONP;
        this._baseResponseOptions = _baseResponseOptions;
    }
    /**
     * @param {?} request
     * @return {?}
     */
    createConnection(request) {
        return new JSONPConnection_(request, this._browserJSONP, this._baseResponseOptions);
    }
}
JSONPBackend_.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
JSONPBackend_.ctorParameters = () => [
    { type: BrowserJsonp, },
    { type: ResponseOptions, },
];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const XSSI_PREFIX = /^\)\]\}',?\n/;
/**
 * Creates connections using `XMLHttpRequest`. Given a fully-qualified
 * request, an `XHRConnection` will immediately create an `XMLHttpRequest` object and send the
 * request.
 *
 * This class would typically not be created or interacted with directly inside applications, though
 * the {\@link MockConnection} may be interacted with in tests.
 *
 * \@experimental
 */
class XHRConnection {
    /**
     * @param {?} req
     * @param {?} browserXHR
     * @param {?=} baseResponseOptions
     */
    constructor(req, browserXHR, baseResponseOptions) {
        this.request = req;
        this.response = new Observable((responseObserver) => {
            const _xhr = browserXHR.build();
            _xhr.open(RequestMethod[req.method].toUpperCase(), req.url);
            if (req.withCredentials != null) {
                _xhr.withCredentials = req.withCredentials;
            }
            // load event handler
            const onLoad = () => {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                let status = _xhr.status === 1223 ? 204 : _xhr.status;
                let body = null;
                // HTTP 204 means no content
                if (status !== 204) {
                    // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                    // response/responseType properties were introduced in ResourceLoader Level2 spec
                    // (supported by IE10)
                    body = (typeof _xhr.response === 'undefined') ? _xhr.responseText : _xhr.response;
                    // Implicitly strip a potential XSSI prefix.
                    if (typeof body === 'string') {
                        body = body.replace(XSSI_PREFIX, '');
                    }
                }
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = body ? 200 : 0;
                }
                const headers = Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                // IE 9 does not provide the way to get URL of response
                const url = getResponseURL(_xhr) || req.url;
                const statusText = _xhr.statusText || 'OK';
                let responseOptions = new ResponseOptions({ body, status, headers, statusText, url });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                const response = new Response(responseOptions);
                response.ok = isSuccess(status);
                if (response.ok) {
                    responseObserver.next(response);
                    // TODO(gdi2290): defer complete if array buffer until done
                    responseObserver.complete();
                    return;
                }
                responseObserver.error(response);
            };
            // error event handler
            const onError = (err) => {
                let responseOptions = new ResponseOptions({
                    body: err,
                    type: ResponseType.Error,
                    status: _xhr.status,
                    statusText: _xhr.statusText,
                });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new Response(responseOptions));
            };
            this.setDetectedContentType(req, _xhr);
            if (req.headers == null) {
                req.headers = new Headers();
            }
            if (!req.headers.has('Accept')) {
                req.headers.append('Accept', 'application/json, text/plain, */*');
            }
            req.headers.forEach((values, name) => _xhr.setRequestHeader(name, values.join(',')));
            // Select the correct buffer type to store the response
            if (req.responseType != null && _xhr.responseType != null) {
                switch (req.responseType) {
                    case ResponseContentType.ArrayBuffer:
                        _xhr.responseType = 'arraybuffer';
                        break;
                    case ResponseContentType.Json:
                        _xhr.responseType = 'json';
                        break;
                    case ResponseContentType.Text:
                        _xhr.responseType = 'text';
                        break;
                    case ResponseContentType.Blob:
                        _xhr.responseType = 'blob';
                        break;
                    default:
                        throw new Error('The selected responseType is not supported');
                }
            }
            _xhr.addEventListener('load', onLoad);
            _xhr.addEventListener('error', onError);
            _xhr.send(this.request.getBody());
            return () => {
                _xhr.removeEventListener('load', onLoad);
                _xhr.removeEventListener('error', onError);
                _xhr.abort();
            };
        });
    }
    /**
     * @param {?} req
     * @param {?} _xhr
     * @return {?}
     */
    setDetectedContentType(req /** TODO Request */, _xhr /** XMLHttpRequest */) {
        // Skip if a custom Content-Type header is provided
        if (req.headers != null && req.headers.get('Content-Type') != null) {
            return;
        }
        // Set the detected content type
        switch (req.contentType) {
            case ContentType.NONE:
                break;
            case ContentType.JSON:
                _xhr.setRequestHeader('content-type', 'application/json');
                break;
            case ContentType.FORM:
                _xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                break;
            case ContentType.TEXT:
                _xhr.setRequestHeader('content-type', 'text/plain');
                break;
            case ContentType.BLOB:
                const /** @type {?} */ blob = req.blob();
                if (blob.type) {
                    _xhr.setRequestHeader('content-type', blob.type);
                }
                break;
        }
    }
}
/**
 * `XSRFConfiguration` sets up Cross Site Request Forgery (XSRF) protection for the application
 * using a cookie. See https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
 * for more information on XSRF.
 *
 * Applications can configure custom cookie and header names by binding an instance of this class
 * with different `cookieName` and `headerName` values. See the main HTTP documentation for more
 * details.
 *
 * \@experimental
 */
class CookieXSRFStrategy {
    /**
     * @param {?=} _cookieName
     * @param {?=} _headerName
     */
    constructor(_cookieName = 'XSRF-TOKEN', _headerName = 'X-XSRF-TOKEN') {
        this._cookieName = _cookieName;
        this._headerName = _headerName;
    }
    /**
     * @param {?} req
     * @return {?}
     */
    configureRequest(req) {
        const /** @type {?} */ xsrfToken = ɵgetDOM().getCookie(this._cookieName);
        if (xsrfToken) {
            req.headers.set(this._headerName, xsrfToken);
        }
    }
}
/**
 * Creates {\@link XHRConnection} instances.
 *
 * This class would typically not be used by end users, but could be
 * overridden if a different backend implementation should be used,
 * such as in a node backend.
 *
 * ### Example
 *
 * ```
 * import {Http, MyNodeBackend, HTTP_PROVIDERS, BaseRequestOptions} from '\@angular/http';
 * \@Component({
 *   viewProviders: [
 *     HTTP_PROVIDERS,
 *     {provide: Http, useFactory: (backend, options) => {
 *       return new Http(backend, options);
 *     }, deps: [MyNodeBackend, BaseRequestOptions]}]
 * })
 * class MyComponent {
 *   constructor(http:Http) {
 *     http.request('people.json').subscribe(res => this.people = res.json());
 *   }
 * }
 * ```
 * \@experimental
 */
class XHRBackend {
    /**
     * @param {?} _browserXHR
     * @param {?} _baseResponseOptions
     * @param {?} _xsrfStrategy
     */
    constructor(_browserXHR, _baseResponseOptions, _xsrfStrategy) {
        this._browserXHR = _browserXHR;
        this._baseResponseOptions = _baseResponseOptions;
        this._xsrfStrategy = _xsrfStrategy;
    }
    /**
     * @param {?} request
     * @return {?}
     */
    createConnection(request) {
        this._xsrfStrategy.configureRequest(request);
        return new XHRConnection(request, this._browserXHR, this._baseResponseOptions);
    }
}
XHRBackend.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
XHRBackend.ctorParameters = () => [
    { type: BrowserXhr, },
    { type: ResponseOptions, },
    { type: XSRFStrategy, },
];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates a request options object to be optionally provided when instantiating a
 * {\@link Request}.
 *
 * This class is based on the `RequestInit` description in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#requestinit).
 *
 * All values are null by default. Typical defaults can be found in the {\@link BaseRequestOptions}
 * class, which sub-classes `RequestOptions`.
 *
 * ```typescript
 * import {RequestOptions, Request, RequestMethod} from '\@angular/http';
 *
 * const options = new RequestOptions({
 *   method: RequestMethod.Post,
 *   url: 'https://google.com'
 * });
 * const req = new Request(options);
 * console.log('req.method:', RequestMethod[req.method]); // Post
 * console.log('options.url:', options.url); // https://google.com
 * ```
 *
 * \@experimental
 */
class RequestOptions {
    /**
     * @deprecated from 4.0.0. Use params instead.
     * @return {?}
     */
    get search() { return this.params; }
    /**
     * @deprecated from 4.0.0. Use params instead.
     * @param {?} params
     * @return {?}
     */
    set search(params) { this.params = params; }
    /**
     * @param {?=} __0
     */
    constructor({ method, headers, body, url, search, params, withCredentials, responseType } = {}) {
        this.method = method != null ? normalizeMethodName(method) : null;
        this.headers = headers != null ? headers : null;
        this.body = body != null ? body : null;
        this.url = url != null ? url : null;
        this.params = this._mergeSearchParams(params || search);
        this.withCredentials = withCredentials != null ? withCredentials : null;
        this.responseType = responseType != null ? responseType : null;
    }
    /**
     * Creates a copy of the `RequestOptions` instance, using the optional input as values to override
     * existing values. This method will not change the values of the instance on which it is being
     * called.
     *
     * Note that `headers` and `search` will override existing values completely if present in
     * the `options` object. If these values should be merged, it should be done prior to calling
     * `merge` on the `RequestOptions` instance.
     *
     * ```typescript
     * import {RequestOptions, Request, RequestMethod} from '\@angular/http';
     *
     * const options = new RequestOptions({
     *   method: RequestMethod.Post
     * });
     * const req = new Request(options.merge({
     *   url: 'https://google.com'
     * }));
     * console.log('req.method:', RequestMethod[req.method]); // Post
     * console.log('options.url:', options.url); // null
     * console.log('req.url:', req.url); // https://google.com
     * ```
     * @param {?=} options
     * @return {?}
     */
    merge(options) {
        return new RequestOptions({
            method: options && options.method != null ? options.method : this.method,
            headers: options && options.headers != null ? options.headers : new Headers(this.headers),
            body: options && options.body != null ? options.body : this.body,
            url: options && options.url != null ? options.url : this.url,
            params: options && this._mergeSearchParams(options.params || options.search),
            withCredentials: options && options.withCredentials != null ? options.withCredentials :
                this.withCredentials,
            responseType: options && options.responseType != null ? options.responseType :
                this.responseType
        });
    }
    /**
     * @param {?=} params
     * @return {?}
     */
    _mergeSearchParams(params) {
        if (!params)
            return this.params;
        if (params instanceof URLSearchParams) {
            return params.clone();
        }
        if (typeof params === 'string') {
            return new URLSearchParams(params);
        }
        return this._parseParams(params);
    }
    /**
     * @param {?=} objParams
     * @return {?}
     */
    _parseParams(objParams = {}) {
        const /** @type {?} */ params = new URLSearchParams();
        Object.keys(objParams).forEach((key) => {
            const /** @type {?} */ value = objParams[key];
            if (Array.isArray(value)) {
                value.forEach((item) => this._appendParam(key, item, params));
            }
            else {
                this._appendParam(key, value, params);
            }
        });
        return params;
    }
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} params
     * @return {?}
     */
    _appendParam(key, value, params) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        params.append(key, value);
    }
}
/**
 * Subclass of {\@link RequestOptions}, with default values.
 *
 * Default values:
 *  * method: {\@link RequestMethod RequestMethod.Get}
 *  * headers: empty {\@link Headers} object
 *
 * This class could be extended and bound to the {\@link RequestOptions} class
 * when configuring an {\@link Injector}, in order to override the default options
 * used by {\@link Http} to create and send {\@link Request Requests}.
 *
 * ```typescript
 * import {BaseRequestOptions, RequestOptions} from '\@angular/http';
 *
 * class MyOptions extends BaseRequestOptions {
 *   search: string = 'coreTeam=true';
 * }
 *
 * {provide: RequestOptions, useClass: MyOptions};
 * ```
 *
 * The options could also be extended when manually creating a {\@link Request}
 * object.
 *
 * ```
 * import {BaseRequestOptions, Request, RequestMethod} from '\@angular/http';
 *
 * const options = new BaseRequestOptions();
 * const req = new Request(options.merge({
 *   method: RequestMethod.Post,
 *   url: 'https://google.com'
 * }));
 * console.log('req.method:', RequestMethod[req.method]); // Post
 * console.log('options.url:', options.url); // null
 * console.log('req.url:', req.url); // https://google.com
 * ```
 *
 * \@experimental
 */
class BaseRequestOptions extends RequestOptions {
    constructor() { super({ method: RequestMethod.Get, headers: new Headers() }); }
}
BaseRequestOptions.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
BaseRequestOptions.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates `Request` instances from provided values.
 *
 * The Request's interface is inspired by the Request constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#request-class),
 * but is considered a static value whose body can be accessed many times. There are other
 * differences in the implementation, but this is the most significant.
 *
 * `Request` instances are typically created by higher-level classes, like {\@link Http} and
 * {\@link Jsonp}, but it may occasionally be useful to explicitly create `Request` instances.
 * One such example is when creating services that wrap higher-level services, like {\@link Http},
 * where it may be useful to generate a `Request` with arbitrary headers and search params.
 *
 * ```typescript
 * import {Injectable, Injector} from '\@angular/core';
 * import {HTTP_PROVIDERS, Http, Request, RequestMethod} from '\@angular/http';
 *
 * \@Injectable()
 * class AutoAuthenticator {
 *   constructor(public http:Http) {}
 *   request(url:string) {
 *     return this.http.request(new Request({
 *       method: RequestMethod.Get,
 *       url: url,
 *       search: 'password=123'
 *     }));
 *   }
 * }
 *
 * var injector = Injector.resolveAndCreate([HTTP_PROVIDERS, AutoAuthenticator]);
 * var authenticator = injector.get(AutoAuthenticator);
 * authenticator.request('people.json').subscribe(res => {
 *   //URL should have included '?password=123'
 *   console.log('people', res.json());
 * });
 * ```
 *
 * \@experimental
 */
class Request extends Body {
    /**
     * @param {?} requestOptions
     */
    constructor(requestOptions) {
        super();
        // TODO: assert that url is present
        const url = requestOptions.url;
        this.url = requestOptions.url;
        const paramsArg = requestOptions.params || requestOptions.search;
        if (paramsArg) {
            let params;
            if (typeof paramsArg === 'object' && !(paramsArg instanceof URLSearchParams)) {
                params = urlEncodeParams(paramsArg).toString();
            }
            else {
                params = paramsArg.toString();
            }
            if (params.length > 0) {
                let prefix = '?';
                if (this.url.indexOf('?') != -1) {
                    prefix = (this.url[this.url.length - 1] == '&') ? '' : '&';
                }
                // TODO: just delete search-query-looking string in url?
                this.url = url + prefix + params;
            }
        }
        this._body = requestOptions.body;
        this.method = normalizeMethodName(requestOptions.method);
        // TODO(jeffbcross): implement behavior
        // Defaults to 'omit', consistent with browser
        this.headers = new Headers(requestOptions.headers);
        this.contentType = this.detectContentType();
        this.withCredentials = requestOptions.withCredentials;
        this.responseType = requestOptions.responseType;
    }
    /**
     * Returns the content type enum based on header options.
     * @return {?}
     */
    detectContentType() {
        switch (this.headers.get('content-type')) {
            case 'application/json':
                return ContentType.JSON;
            case 'application/x-www-form-urlencoded':
                return ContentType.FORM;
            case 'multipart/form-data':
                return ContentType.FORM_DATA;
            case 'text/plain':
            case 'text/html':
                return ContentType.TEXT;
            case 'application/octet-stream':
                return this._body instanceof ArrayBuffer$1 ? ContentType.ARRAY_BUFFER : ContentType.BLOB;
            default:
                return this.detectContentTypeFromBody();
        }
    }
    /**
     * Returns the content type of request's body based on its type.
     * @return {?}
     */
    detectContentTypeFromBody() {
        if (this._body == null) {
            return ContentType.NONE;
        }
        else if (this._body instanceof URLSearchParams) {
            return ContentType.FORM;
        }
        else if (this._body instanceof FormData) {
            return ContentType.FORM_DATA;
        }
        else if (this._body instanceof Blob$1) {
            return ContentType.BLOB;
        }
        else if (this._body instanceof ArrayBuffer$1) {
            return ContentType.ARRAY_BUFFER;
        }
        else if (this._body && typeof this._body === 'object') {
            return ContentType.JSON;
        }
        else {
            return ContentType.TEXT;
        }
    }
    /**
     * Returns the request's body according to its type. If body is undefined, return
     * null.
     * @return {?}
     */
    getBody() {
        switch (this.contentType) {
            case ContentType.JSON:
                return this.text();
            case ContentType.FORM:
                return this.text();
            case ContentType.FORM_DATA:
                return this._body;
            case ContentType.TEXT:
                return this.text();
            case ContentType.BLOB:
                return this.blob();
            case ContentType.ARRAY_BUFFER:
                return this.arrayBuffer();
            default:
                return null;
        }
    }
}
/**
 * @param {?} params
 * @return {?}
 */
function urlEncodeParams(params) {
    const /** @type {?} */ searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        const /** @type {?} */ value = params[key];
        if (value && Array.isArray(value)) {
            value.forEach(element => searchParams.append(key, element.toString()));
        }
        else {
            searchParams.append(key, value.toString());
        }
    });
    return searchParams;
}
const noop = function () { };
const w = typeof window == 'object' ? window : noop;
const FormData = ((w) /** TODO #9100 */)['FormData'] || noop;
const Blob$1 = ((w) /** TODO #9100 */)['Blob'] || noop;
const ArrayBuffer$1 = ((w) /** TODO #9100 */)['ArrayBuffer'] || noop;

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} backend
 * @param {?} request
 * @return {?}
 */
function httpRequest(backend, request) {
    return backend.createConnection(request).response;
}
/**
 * @param {?} defaultOpts
 * @param {?} providedOpts
 * @param {?} method
 * @param {?} url
 * @return {?}
 */
function mergeOptions(defaultOpts, providedOpts, method, url) {
    const /** @type {?} */ newOptions = defaultOpts;
    if (providedOpts) {
        // Hack so Dart can used named parameters
        return (newOptions.merge(new RequestOptions({
            method: providedOpts.method || method,
            url: providedOpts.url || url,
            search: providedOpts.search,
            params: providedOpts.params,
            headers: providedOpts.headers,
            body: providedOpts.body,
            withCredentials: providedOpts.withCredentials,
            responseType: providedOpts.responseType
        })));
    }
    return (newOptions.merge(new RequestOptions({ method, url })));
}
/**
 * Performs http requests using `XMLHttpRequest` as the default backend.
 *
 * `Http` is available as an injectable class, with methods to perform http requests. Calling
 * `request` returns an `Observable` which will emit a single {\@link Response} when a
 * response is received.
 *
 * ### Example
 *
 * ```typescript
 * import {Http, HTTP_PROVIDERS} from '\@angular/http';
 * import 'rxjs/add/operator/map'
 * \@Component({
 *   selector: 'http-app',
 *   viewProviders: [HTTP_PROVIDERS],
 *   templateUrl: 'people.html'
 * })
 * class PeopleComponent {
 *   constructor(http: Http) {
 *     http.get('people.json')
 *       // Call map on the response observable to get the parsed people object
 *       .map(res => res.json())
 *       // Subscribe to the observable to get the parsed people object and attach it to the
 *       // component
 *       .subscribe(people => this.people = people);
 *   }
 * }
 * ```
 *
 *
 * ### Example
 *
 * ```
 * http.get('people.json').subscribe((res:Response) => this.people = res.json());
 * ```
 *
 * The default construct used to perform requests, `XMLHttpRequest`, is abstracted as a "Backend" (
 * {\@link XHRBackend} in this case), which could be mocked with dependency injection by replacing
 * the {\@link XHRBackend} provider, as in the following example:
 *
 * ### Example
 *
 * ```typescript
 * import {BaseRequestOptions, Http} from '\@angular/http';
 * import {MockBackend} from '\@angular/http/testing';
 * var injector = Injector.resolveAndCreate([
 *   BaseRequestOptions,
 *   MockBackend,
 *   {provide: Http, useFactory:
 *       function(backend, defaultOptions) {
 *         return new Http(backend, defaultOptions);
 *       },
 *       deps: [MockBackend, BaseRequestOptions]}
 * ]);
 * var http = injector.get(Http);
 * http.get('request-from-mock-backend.json').subscribe((res:Response) => doSomething(res));
 * ```
 *
 * \@experimental
 */
class Http {
    /**
     * @param {?} _backend
     * @param {?} _defaultOptions
     */
    constructor(_backend, _defaultOptions) {
        this._backend = _backend;
        this._defaultOptions = _defaultOptions;
    }
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {\@link Request} instance. If the first argument is a url, an optional {\@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {\@link BaseRequestOptions} before performing the request.
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    request(url, options) {
        let /** @type {?} */ responseObservable;
        if (typeof url === 'string') {
            responseObservable = httpRequest(this._backend, new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, /** @type {?} */ (url))));
        }
        else if (url instanceof Request) {
            responseObservable = httpRequest(this._backend, url);
        }
        else {
            throw new Error('First argument must be a url string or Request instance.');
        }
        return responseObservable;
    }
    /**
     * Performs a request with `get` http method.
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    get(url, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, url)));
    }
    /**
     * Performs a request with `post` http method.
     * @param {?} url
     * @param {?} body
     * @param {?=} options
     * @return {?}
     */
    post(url, body, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Post, url)));
    }
    /**
     * Performs a request with `put` http method.
     * @param {?} url
     * @param {?} body
     * @param {?=} options
     * @return {?}
     */
    put(url, body, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Put, url)));
    }
    /**
     * Performs a request with `delete` http method.
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    delete(url, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Delete, url)));
    }
    /**
     * Performs a request with `patch` http method.
     * @param {?} url
     * @param {?} body
     * @param {?=} options
     * @return {?}
     */
    patch(url, body, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Patch, url)));
    }
    /**
     * Performs a request with `head` http method.
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    head(url, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Head, url)));
    }
    /**
     * Performs a request with `options` http method.
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    options(url, options) {
        return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Options, url)));
    }
}
Http.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Http.ctorParameters = () => [
    { type: ConnectionBackend, },
    { type: RequestOptions, },
];
/**
 * \@experimental
 */
class Jsonp extends Http {
    /**
     * @param {?} backend
     * @param {?} defaultOptions
     */
    constructor(backend, defaultOptions) {
        super(backend, defaultOptions);
    }
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {\@link Request} instance. If the first argument is a url, an optional {\@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {\@link BaseRequestOptions} before performing the request.
     *
     * \@security Regular XHR is the safest alternative to JSONP for most applications, and is
     * supported by all current browsers. Because JSONP creates a `<script>` element with
     * contents retrieved from a remote source, attacker-controlled data introduced by an untrusted
     * source could expose your application to XSS risks. Data exposed by JSONP may also be
     * readable by malicious third-party websites. In addition, JSONP introduces potential risk for
     * future security issues (e.g. content sniffing).  For more detail, see the
     * [Security Guide](http://g.co/ng/security).
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    request(url, options) {
        let /** @type {?} */ responseObservable;
        if (typeof url === 'string') {
            url =
                new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, /** @type {?} */ (url)));
        }
        if (url instanceof Request) {
            if (url.method !== RequestMethod.Get) {
                throw new Error('JSONP requests must use GET request method.');
            }
            responseObservable = httpRequest(this._backend, url);
        }
        else {
            throw new Error('First argument must be a url string or Request instance.');
        }
        return responseObservable;
    }
}
Jsonp.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Jsonp.ctorParameters = () => [
    { type: ConnectionBackend, },
    { type: RequestOptions, },
];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * The http module provides services to perform http requests. To get started, see the {@link Http}
 * class.
 */
/**
 * @return {?}
 */
function _createDefaultCookieXSRFStrategy() {
    return new CookieXSRFStrategy();
}
/**
 * @param {?} xhrBackend
 * @param {?} requestOptions
 * @return {?}
 */
function httpFactory(xhrBackend, requestOptions) {
    return new Http(xhrBackend, requestOptions);
}
/**
 * @param {?} jsonpBackend
 * @param {?} requestOptions
 * @return {?}
 */
function jsonpFactory(jsonpBackend, requestOptions) {
    return new Jsonp(jsonpBackend, requestOptions);
}
/**
 * The module that includes http's providers
 *
 * \@experimental
 */
class HttpModule {
}
HttpModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    // TODO(pascal): use factory type annotations once supported in DI
                    // issue: https://github.com/angular/angular/issues/3183
                    { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions] },
                    BrowserXhr,
                    { provide: RequestOptions, useClass: BaseRequestOptions },
                    { provide: ResponseOptions, useClass: BaseResponseOptions },
                    XHRBackend,
                    { provide: XSRFStrategy, useFactory: _createDefaultCookieXSRFStrategy },
                ],
            },] },
];
/**
 * @nocollapse
 */
HttpModule.ctorParameters = () => [];
/**
 * The module that includes jsonp's providers
 *
 * \@experimental
 */
class JsonpModule {
}
JsonpModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    // TODO(pascal): use factory type annotations once supported in DI
                    // issue: https://github.com/angular/angular/issues/3183
                    { provide: Jsonp, useFactory: jsonpFactory, deps: [JSONPBackend, RequestOptions] },
                    BrowserJsonp,
                    { provide: RequestOptions, useClass: BaseRequestOptions },
                    { provide: ResponseOptions, useClass: BaseResponseOptions },
                    { provide: JSONPBackend, useClass: JSONPBackend_ },
                ],
            },] },
];
/**
 * @nocollapse
 */
JsonpModule.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the common package.
 */
/**
 * \@stable
 */
const VERSION = new Version('4.1.3');

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the http package.
 */

// This file only reexports content of the `src` folder. Keep it that way.

/**
 * Generated bundle index. Do not edit.
 */

export { BrowserXhr, JSONPBackend, JSONPConnection, CookieXSRFStrategy, XHRBackend, XHRConnection, BaseRequestOptions, RequestOptions, BaseResponseOptions, ResponseOptions, ReadyState, RequestMethod, ResponseContentType, ResponseType, Headers, Http, Jsonp, HttpModule, JsonpModule, Connection, ConnectionBackend, XSRFStrategy, Request, Response, QueryEncoder, URLSearchParams, VERSION, BrowserJsonp as ɵg, JSONPBackend_ as ɵa, Body as ɵf, _createDefaultCookieXSRFStrategy as ɵb, httpFactory as ɵc, jsonpFactory as ɵd };
//# sourceMappingURL=http.js.map
