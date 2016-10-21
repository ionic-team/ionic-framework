/**
 * This class is an internal error handler for Ionic. We can often add
 * some nice goodies to the dev/debugging process by reporting to our
 * dev server. To use this class, call `IonicErrorHandler.handleError(err)` from
 * inside a custom `ErrorHandler` as described here: https://angular.io/docs/ts/latest/api/core/index/ErrorHandler-class.html
 */
export class IonicErrorHandler {
  static handleError(err: any): void {
    let server = window['IonicDevServer'];
    if (server) {
      server.handleError(err);
    }
  }
}
