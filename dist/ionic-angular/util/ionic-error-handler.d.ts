import { ErrorHandler } from '@angular/core';
/**
 * @name IonicErrorHandler
 * @description
 * The `IonicErrorHandler` intercepts the default `Console` error handling
 * and displays runtime errors as an overlay when using Ionic's Dev Build Server.
 *
 *
 * ### IonicErrorHandler Example
 *
 * ```typescript
 * import { NgModule, ErrorHandler } from '@angular/core';
 * import { IonicErrorHandler } from 'ionic-angular';
 *
 * @NgModule({
 *   providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
 * })
 * class AppModule {}
 * ```
 *
 *
 * ### Custom Error Handlers
 *
 * Custom error handlers can be built to replace the default, or extend Ionic's
 * error handler.
 *
 * ```typescript
 * class MyErrorHandler implements ErrorHandler {
 *   handleError(err: any): void {
 *     // do something with the error
 *   }
 * }
 *
 * @NgModule({
 *   providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }]
 * })
 * class AppModule {}
 * ```
 *
 * More information about Angular's [`ErrorHandler`](https://angular.io/docs/ts/latest/api/core/index/ErrorHandler-class.html).
 */
export declare class IonicErrorHandler extends ErrorHandler {
    constructor();
    /**
     * @internal
     */
    handleError(err: any): void;
}
