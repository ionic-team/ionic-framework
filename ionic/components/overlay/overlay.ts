import {Component} from 'angular2/angular2';
import {DirectiveBinding} from 'angular2/src/core/compiler/element_injector';

import {IonicApp} from '../app/app';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


export class Overlay {

  constructor(app: IonicApp, config: IonicConfig) {
    this.app = app;
    this.config = config;
    this.mode = config.setting('mode');
  }

  create(overlayType, componentType: Type, opts={}, context=null) {
    return new Promise((resolve, reject) => {
      let app = this.app;

      let annotation = new Component({
        selector: 'ion-' + overlayType,
        host: {
          '[style.z-index]': 'zIndex',
          'mode': this.mode,
          'class': overlayType
        }
      });
      let overlayComponentType = DirectiveBinding.createFromType(componentType, annotation);

      // create a unique token that works as a cache key
      overlayComponentType.token = overlayType + componentType.name;

      app.appendComponent(overlayComponentType).then(ref => {
        let overlayRef = new OverlayRef(app, overlayType, opts, ref, context);
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
  constructor(app, overlayType, opts, ref, context) {
    this.app = app;

    let overlayInstance = (ref && ref.instance);
    if (!overlayInstance) return;

    if (context) {
      util.extend(ref.instance, context);
    }
    this._instance = overlayInstance;

    overlayInstance.onViewLoaded && overlayInstance.onViewLoaded();

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

    this._elementRef = ref.location;
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
      let instance = this._instance || {};
      instance.onViewWillEnter && instance.onViewWillEnter();

      let animationName = (opts && opts.animation) || this._opts.enterAnimation;
      let animation = Animation.create(this._elementRef.nativeElement, animationName);

      animation.before.addClass('show-overlay');

      this.app.setEnabled(false, animation.duration());
      this.app.setTransitioning(true, animation.duration());

      this.app.zoneRunOutside(() => {

        animation.play().then(() => {

          this.app.zoneRun(() => {
            this.app.setEnabled(true);
            this.app.setTransitioning(false);
            animation.dispose();
            instance.onViewDidEnter && instance.onViewDidEnter();
            resolve();
          });

        });

      });

    }).catch(err => {
      console.error(err);
    });
  }

  close(opts={}) {
    return new Promise(resolve => {
      let instance = this._instance || {};
      instance.onViewWillLeave && instance.onViewWillLeave();
      instance.onViewWillUnload && instance.onViewWillUnload();

      let animationName = (opts && opts.animation) || this._opts.leaveAnimation;
      let animation = Animation.create(this._elementRef.nativeElement, animationName);

      animation.after.removeClass('show-overlay');
      this.app.setEnabled(false, animation.duration());
      this.app.setTransitioning(true, animation.duration());

      animation.play().then(() => {
        instance.onViewDidLeave && instance.onViewDidLeave();
        instance.onViewDidUnload && instance.onViewDidUnload();

        this._dispose();

        this.app.setEnabled(true);
        this.app.setTransitioning(false);
        animation.dispose();

        resolve();
      })
    }).catch(err => {
      console.error(err);
    });
  }

}

const ROOT_Z_INDEX = 1000;
