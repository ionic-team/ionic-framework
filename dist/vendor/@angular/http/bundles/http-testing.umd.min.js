/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
!function(global,factory){"object"==typeof exports&&"undefined"!=typeof module?factory(exports,require("@angular/core"),require("@angular/http"),require("rxjs/ReplaySubject"),require("rxjs/Subject"),require("rxjs/operator/take")):"function"==typeof define&&define.amd?define(["exports","@angular/core","@angular/http","rxjs/ReplaySubject","rxjs/Subject","rxjs/operator/take"],factory):factory((global.ng=global.ng||{},global.ng.http=global.ng.http||{},global.ng.http.testing=global.ng.http.testing||{}),global.ng.core,global.ng.http,global.Rx,global.Rx,global.Rx.Observable.prototype)}(this,function(exports,_angular_core,_angular_http,rxjs_ReplaySubject,rxjs_Subject,rxjs_operator_take){"use strict";/**
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
var MockConnection=function(){function MockConnection(req){this.response=rxjs_operator_take.take.call(new rxjs_ReplaySubject.ReplaySubject(1),1),this.readyState=_angular_http.ReadyState.Open,this.request=req}return MockConnection.prototype.mockRespond=function(res){if(this.readyState===_angular_http.ReadyState.Done||this.readyState===_angular_http.ReadyState.Cancelled)throw new Error("Connection has already been resolved");this.readyState=_angular_http.ReadyState.Done,this.response.next(res),this.response.complete()},MockConnection.prototype.mockDownload=function(res){},MockConnection.prototype.mockError=function(err){this.readyState=_angular_http.ReadyState.Done,this.response.error(err)},MockConnection}(),MockBackend=function(){function MockBackend(){var _this=this;this.connectionsArray=[],this.connections=new rxjs_Subject.Subject,this.connections.subscribe(function(connection){return _this.connectionsArray.push(connection)}),this.pendingConnections=new rxjs_Subject.Subject}return MockBackend.prototype.verifyNoPendingRequests=function(){var pending=0;if(this.pendingConnections.subscribe(function(c){return pending++}),pending>0)throw new Error(pending+" pending connections to be resolved")},MockBackend.prototype.resolveAllConnections=function(){this.connections.subscribe(function(c){return c.readyState=4})},MockBackend.prototype.createConnection=function(req){if(!(req&&req instanceof _angular_http.Request))throw new Error("createConnection requires an instance of Request, got "+req);var connection=new MockConnection(req);return this.connections.next(connection),connection},MockBackend}();MockBackend.decorators=[{type:_angular_core.Injectable}],MockBackend.ctorParameters=function(){return[]},exports.MockConnection=MockConnection,exports.MockBackend=MockBackend,Object.defineProperty(exports,"__esModule",{value:!0})});
//# sourceMappingURL=http-testing.umd.min.js.map
