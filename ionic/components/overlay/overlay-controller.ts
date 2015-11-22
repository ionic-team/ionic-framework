import {Animation} from '../../animations/animation';
import {extend} from 'ionic/util';


export class OverlayController {

  open(componentType, params = {}, opts = {}) {
    if (!this.nav) {
      console.error('<ion-overlay></ion-overlay> required in root template (app.html) to use: ' + overlayType);
      return Promise.reject();
    }

    let resolve, reject;
    let promise = new Promise((res, rej) => { resolve = res; reject = rej; });

    opts.animation = opts.enterAnimation;
    opts.animateFirst = true;

    this.nav.push(componentType, params, opts).then(enteringView => {
      if (enteringView && enteringView.instance) {
        enteringView.instance.close = (closeOpts={}) => {
          extend(opts, closeOpts);
          opts.animation = opts.leaveAnimation;
          this.nav.pop(opts);
        };
      }
      resolve();
    })

    return promise;
  }

  getByType(overlayType) {
    let overlay = this.nav.getByType(overlayType);
    return overlay && overlay.instance;
  }

  getByHandle(handle, overlayType) {
    let overlay = this.nav.getByHandle(handle);
    return overlay && overlay.instance;
  }

}


const ROOT_Z_INDEX = 1000;
