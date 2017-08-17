/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs/ReplaySubject'), require('rxjs/Subject'), require('rxjs/operator/take')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'rxjs/ReplaySubject', 'rxjs/Subject', 'rxjs/operator/take'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.http = global.ng.http || {}, global.ng.http.testing = global.ng.http.testing || {}),global.ng.core,global.ng.http,global.Rx,global.Rx,global.Rx.Observable.prototype));
}(this, (function (exports,_angular_core,_angular_http,rxjs_ReplaySubject,rxjs_Subject,rxjs_operator_take) { 'use strict';

/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 *
 * Mock Connection to represent a {\@link Connection} for tests.
 *
 * \@experimental
 */
var MockConnection = (function () {
    /**
     * @param {?} req
     */
    function MockConnection(req) {
        this.response = rxjs_operator_take.take.call(new rxjs_ReplaySubject.ReplaySubject(1), 1);
        this.readyState = _angular_http.ReadyState.Open;
        this.request = req;
    }
    /**
     * Sends a mock response to the connection. This response is the value that is emitted to the
     * {\@link EventEmitter} returned by {\@link Http}.
     *
     * ### Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => console.log(res.text()));
     * connection.mockRespond(new Response(new ResponseOptions({ body: 'fake response' }))); //logs
     * 'fake response'
     * ```
     *
     * @param {?} res
     * @return {?}
     */
    MockConnection.prototype.mockRespond = function (res) {
        if (this.readyState === _angular_http.ReadyState.Done || this.readyState === _angular_http.ReadyState.Cancelled) {
            throw new Error('Connection has already been resolved');
        }
        this.readyState = _angular_http.ReadyState.Done;
        this.response.next(res);
        this.response.complete();
    };
    /**
     * Not yet implemented!
     *
     * Sends the provided {\@link Response} to the `downloadObserver` of the `Request`
     * associated with this connection.
     * @param {?} res
     * @return {?}
     */
    MockConnection.prototype.mockDownload = function (res) {
        // this.request.downloadObserver.onNext(res);
        // if (res.bytesLoaded === res.totalBytes) {
        //   this.request.downloadObserver.onCompleted();
        // }
    };
    /**
     * Emits the provided error object as an error to the {\@link Response} {\@link EventEmitter}
     * returned
     * from {\@link Http}.
     *
     * ### Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => res, err => console.log(err)));
     * connection.mockError(new Error('error'));
     * ```
     *
     * @param {?=} err
     * @return {?}
     */
    MockConnection.prototype.mockError = function (err) {
        // Matches ResourceLoader semantics
        this.readyState = _angular_http.ReadyState.Done;
        this.response.error(err);
    };
    return MockConnection;
}());
/**
 * A mock backend for testing the {\@link Http} service.
 *
 * This class can be injected in tests, and should be used to override providers
 * to other backends, such as {\@link XHRBackend}.
 *
 * ### Example
 *
 * ```
 * import {Injectable, ReflectiveInjector} from '\@angular/core';
 * import {async, fakeAsync, tick} from '\@angular/core/testing';
 * import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '\@angular/http';
 * import {Response, ResponseOptions} from '\@angular/http';
 * import {MockBackend, MockConnection} from '\@angular/http/testing';
 *
 * const HERO_ONE = 'HeroNrOne';
 * const HERO_TWO = 'WillBeAlwaysTheSecond';
 *
 * \@Injectable()
 * class HeroService {
 *   constructor(private http: Http) {}
 *
 *   getHeroes(): Promise<String[]> {
 *     return this.http.get('myservices.de/api/heroes')
 *         .toPromise()
 *         .then(response => response.json().data)
 *         .catch(e => this.handleError(e));
 *   }
 *
 *   private handleError(error: any): Promise<any> {
 *     console.error('An error occurred', error);
 *     return Promise.reject(error.message || error);
 *   }
 * }
 *
 * describe('MockBackend HeroService Example', () => {
 *   beforeEach(() => {
 *     this.injector = ReflectiveInjector.resolveAndCreate([
 *       {provide: ConnectionBackend, useClass: MockBackend},
 *       {provide: RequestOptions, useClass: BaseRequestOptions},
 *       Http,
 *       HeroService,
 *     ]);
 *     this.heroService = this.injector.get(HeroService);
 *     this.backend = this.injector.get(ConnectionBackend) as MockBackend;
 *     this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
 *   });
 *
 *   it('getHeroes() should query current service url', () => {
 *     this.heroService.getHeroes();
 *     expect(this.lastConnection).toBeDefined('no http service connection at all?');
 *     expect(this.lastConnection.request.url).toMatch(/api\/heroes$/, 'url invalid');
 *   });
 *
 *   it('getHeroes() should return some heroes', fakeAsync(() => {
 *        let result: String[];
 *        this.heroService.getHeroes().then((heroes: String[]) => result = heroes);
 *        this.lastConnection.mockRespond(new Response(new ResponseOptions({
 *          body: JSON.stringify({data: [HERO_ONE, HERO_TWO]}),
 *        })));
 *        tick();
 *        expect(result.length).toEqual(2, 'should contain given amount of heroes');
 *        expect(result[0]).toEqual(HERO_ONE, ' HERO_ONE should be the first hero');
 *        expect(result[1]).toEqual(HERO_TWO, ' HERO_TWO should be the second hero');
 *      }));
 *
 *   it('getHeroes() while server is down', fakeAsync(() => {
 *        let result: String[];
 *        let catchedError: any;
 *        this.heroService.getHeroes()
 *            .then((heroes: String[]) => result = heroes)
 *            .catch((error: any) => catchedError = error);
 *        this.lastConnection.mockRespond(new Response(new ResponseOptions({
 *          status: 404,
 *          statusText: 'URL not Found',
 *        })));
 *        tick();
 *        expect(result).toBeUndefined();
 *        expect(catchedError).toBeDefined();
 *      }));
 * });
 * ```
 *
 * This method only exists in the mock implementation, not in real Backends.
 *
 * \@experimental
 */
var MockBackend = (function () {
    function MockBackend() {
        var _this = this;
        this.connectionsArray = [];
        this.connections = new rxjs_Subject.Subject();
        this.connections.subscribe(function (connection) { return _this.connectionsArray.push(connection); });
        this.pendingConnections = new rxjs_Subject.Subject();
    }
    /**
     * Checks all connections, and raises an exception if any connection has not received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     * @return {?}
     */
    MockBackend.prototype.verifyNoPendingRequests = function () {
        var /** @type {?} */ pending = 0;
        this.pendingConnections.subscribe(function (c) { return pending++; });
        if (pending > 0)
            throw new Error(pending + " pending connections to be resolved");
    };
    /**
     * Can be used in conjunction with `verifyNoPendingRequests` to resolve any not-yet-resolve
     * connections, if it's expected that there are connections that have not yet received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     * @return {?}
     */
    MockBackend.prototype.resolveAllConnections = function () { this.connections.subscribe(function (c) { return c.readyState = 4; }); };
    /**
     * Creates a new {\@link MockConnection}. This is equivalent to calling `new
     * MockConnection()`, except that it also will emit the new `Connection` to the `connections`
     * emitter of this `MockBackend` instance. This method will usually only be used by tests
     * against the framework itself, not by end-users.
     * @param {?} req
     * @return {?}
     */
    MockBackend.prototype.createConnection = function (req) {
        if (!req || !(req instanceof _angular_http.Request)) {
            throw new Error("createConnection requires an instance of Request, got " + req);
        }
        var /** @type {?} */ connection = new MockConnection(req);
        this.connections.next(connection);
        return connection;
    };
    return MockBackend;
}());
MockBackend.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MockBackend.ctorParameters = function () { return []; };

exports.MockConnection = MockConnection;
exports.MockBackend = MockBackend;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=http-testing.umd.js.map
