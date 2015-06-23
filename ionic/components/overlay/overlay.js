import {IonicApp} from '../app/app';
import {Animation} from '../../animations/animation';
import {ClickBlock} from '../../util/click-block';
import * as util from 'ionic/util';


export class Overlay {

  constructor(app: IonicApp) {
    this.setApp(app);
  }

  setApp(app) {
    this.app = app;
  }

  create(overlayType, ComponentType: Type, opts) {
    return new Promise((resolve, reject) => {
      let app = this.app;

      app.appendComponent(ComponentType).then(ref => {
        let overlay = ref.instance;
        overlay._dispose = ref.dispose;
        overlay.setApp(app);
        overlay._type = overlayType;
        overlay._handle = opts && opts.handle;
        overlay._domElement = ref.elementRef.domElement;
        overlay.extendOptions(opts);

        overlay.zIndex = ROOT_Z_INDEX;
        for (let i = 0; i < app.overlays.length; i++) {
          if (app.overlays[i].zIndex >= overlay.zIndex) {
            overlay.zIndex = app.overlays[i].zIndex + 1;
          }
        }
        app.overlays.push(overlay);

        overlay._open(opts);

        resolve(overlay);

      }).catch(err => {
        console.error('Overlay create:', err);
        reject(err);
      });

    });
  }

  _open(opts) {
    let animationName = (opts && opts.animation) || this.options.enterAnimation;
    let enterAnimation = Animation.create(this._domElement, animationName);
    enterAnimation.before.addClass('ion-app');
    enterAnimation.before.addClass('show-overlay');
    ClickBlock(true, enterAnimation.duration() + 200);

    return new Promise(resolve => {
      enterAnimation.play().then(() => {
        ClickBlock(false);
        enterAnimation.dispose();
        resolve();
      });
    });
  }

  close(opts) {
    return new Promise(resolve => {
      let animationName = (opts && opts.animation) || this.options.leaveAnimation;
      let leavingAnimation = Animation.create(this._domElement, animationName);
      leavingAnimation.after.removeClass('show-overlay');
      ClickBlock(true, leavingAnimation.duration() + 200);

      leavingAnimation.play().then(() => {
        this.dispose();
        ClickBlock(false);
        leavingAnimation.dispose();
        resolve();
      })
    });
  }

  getByType(overlayType) {
    if (this.app) {
      for (let i = this.app.overlays.length - 1; i >= 0; i--) {
        if (overlayType === this.app.overlays[i]._type) {
          return this.app.overlays[i];
        }
      }
    }
    return null;
  }

  getByHandle(handle) {
    if (this.app) {
      for (let i = this.app.overlays.length - 1; i >= 0; i--) {
        if (handle === this.app.overlays[i]._handle) {
          return this.app.overlays[i];
        }
      }
    }
    return null;
  }

  extendOptions(opts) {
    if (!this.options) this.options = {};
    util.extend(this.options, opts);
  }

  dispose() {
    this._dispose && this._dispose();
    if (this.app) {
      util.array.remove(this.app.overlays, this);
    }
  }

}

const ROOT_Z_INDEX = 1000;
