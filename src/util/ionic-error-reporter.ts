/**
 * @name IonicErrorReporter
 * @description
 * The `IonicErrorReporter` is an interface for error reporting
 *
 *
 * ### IonicErrorReporter Example
 *
 * ```typescript
 * import { NgModule, ErrorHandler } from '@angular/core';
 * import { IonicErrorHandler } from 'ionic-angular';
 *
 * IonicErrorHandler.setErrorReporter(new RollbarErrorReporter(config))
 *
 * @NgModule({
 *   providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
 * })
 * class AppModule {}
 * ```
 *
 *
 * ### Custom Error Reporters
 *
 * Custom error handlers can be built by implementing the IonicErrorReporter interface
 *
 * ```typescript
 * class MyErrorReporter implements IonicErrorReporter {
 *   error(err: Error): void {
 *     // do something with the error
 *   }
 *
 *   warning(err: Error): void {
 *     // do something with the warning
 *   }
 *
 *   info(info: any): void {
 *     // do something with the info
 *   }
 * }
 * ```
 */
export interface IonicErrorReporter {
    error: (error: Error) => void;
    warning: (error: Error) => void;
    info: (info: any) => void;
}
