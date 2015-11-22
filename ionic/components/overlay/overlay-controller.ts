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

    this.nav.push(componentType, params, opts).then(viewCtrl => {
      if (viewCtrl && viewCtrl.instance) {

        let self = this;
        function escape(ev) {
          if (ev.keyCode == 27 && self.nav.last() === viewCtrl) {
            viewCtrl.instance.close();
          }
        }

        viewCtrl.instance.close = (closeOpts={}) => {
          extend(opts, closeOpts);
          opts.animation = opts.leaveAnimation;
          this.nav.pop(opts);
          document.removeEventListener('keyup', escape, true);
        };

        document.addEventListener('keyup', escape, true);
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
