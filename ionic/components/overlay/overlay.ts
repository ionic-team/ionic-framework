import {Component} from 'angular2/angular2';
import {DirectiveBinding} from 'angular2/src/core/compiler/element_injector';

import {IonicApp} from '../app/app';
import {Animation} from '../../animations/animation';
import {ClickBlock} from '../../util/click-block';
import * as util from 'ionic/util';


export class Overlay {

  constructor(app: IonicApp, ionicConfig: IonicConfig) {
    this.app = app;
    this.ionicConfig = ionicConfig;
  }

  create(overlayType, ComponentType: Type, opts={}, context=null) {
    return new Promise((resolve, reject) => {
      let app = this.app;

      let annotation = new Component({
        selector: 'ion-' + overlayType,
        host: {
          '[style.z-index]': 'zIndex',
          'class': overlayType + ' ion-app',
          'mode': this.ionicConfig.setting('mode')
        }
      });
      let overlayComponent = DirectiveBinding.createFromType(ComponentType, annotation);

      app.appendComponent(overlayComponent, context).then(ref => {
        let overlayRef = new OverlayRef(app, overlayType, opts, ref);
        overlayRef._open(opts).then(() => {
          resolve(overlayRef);
        });

      }).catch(err => {
        console.error('Overlay appendComponent:', err);
        reject(err);
      });

    }).catch(err => {
      console.error('Overlay create:', err);
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

  getByHandle(handle, overlayType) {
    if (this.app) {
      for (let i = this.app.overlays.length - 1; i >= 0; i--) {
        if (handle === this.app.overlays[i]._handle &&
            overlayType === this.app.overlays[i]._type) {
          return this.app.overlays[i];
        }
      }
    }
    return null;
  }

}

export class OverlayRef {
  constructor(app, overlayType, opts, ref) {
    let overlayInstance = (ref && ref.instance);
    if (!overlayInstance) return;

    this._instance = overlayInstance;

    overlayInstance.viewLoaded && overlayInstance.viewLoaded();

    this.zIndex = ROOT_Z_INDEX;
    for (let i = 0; i < app.overlays.length; i++) {
      if (app.overlays[i].zIndex >= this.zIndex) {
        this.zIndex = app.overlays[i].zIndex + 1;
      }
    }
    overlayInstance.zIndex = this.zIndex;
    overlayInstance.overlayRef = this;
    overlayInstance.close = (instanceOpts) => {
      this.close(instanceOpts);
    };

    this._elementRef = ref.elementRef;
    this._type = overlayType;
    this._opts = opts;
    this._handle = opts.handle || this.zIndex;

    this._dispose = () => {
      this._instance = null;
      ref.dispose && ref.dispose();
      util.array.remove(app.overlays, this);
    };

    app.overlays.push(this);
  }

  getElementRef() {
    return this._elementRef;
  }

  _open(opts={}) {
    return new Promise(resolve => {
      this._instance.viewWillEnter && this._instance.viewWillEnter();

      let animationName = (opts && opts.animation) || this._opts.enterAnimation;
      let animation = Animation.create(this._elementRef.nativeElement, animationName);

      animation.before.addClass('show-overlay');

      ClickBlock(true, animation.duration() + 200);

      animation.play().then(() => {
        ClickBlock(false);
        animation.dispose();
        this._instance.viewDidEnter && this._instance.viewDidEnter();
        resolve();
      });
    }).catch(err => {
      console.error(err);
    });
  }

  close(opts={}) {
    return new Promise(resolve => {
      this._instance.viewWillLeave && this._instance.viewWillLeave();
      this._instance.viewWillUnload && this._instance.viewWillUnload();

      let animationName = (opts && opts.animation) || this._opts.leaveAnimation;
      let animation = Animation.create(this._elementRef.nativeElement, animationName);

      animation.after.removeClass('show-overlay');
      ClickBlock(true, animation.duration() + 200);

      animation.play().then(() => {
        this._instance.viewDidLeave && this._instance.viewDidLeave();
        this._instance.viewDidUnload && this._instance.viewDidUnload();

        this._dispose();

        ClickBlock(false);
        animation.dispose();

        resolve();
      })
    }).catch(err => {
      console.error(err);
    });
  }

}

const ROOT_Z_INDEX = 1000;
