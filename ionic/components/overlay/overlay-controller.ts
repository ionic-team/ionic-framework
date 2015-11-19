import {Component, NgZone, Injectable, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@Injectable()
export class OverlayController {

  constructor(app: IonicApp, config: Config, zone: NgZone, renderer: Renderer) {
    this.app = app;
    this.config = config;
    this.zone = zone;
    this.renderer = renderer;
    this.refs = [];
  }

  open(overlayType, componentType: Type, opts={}) {
    if (!this.anchor) {
      console.error('<ion-overlay></ion-overlay> required in root component template to use: ' + overlayType);
      return Promise.reject();
    }

    let resolve, reject;
    let promise = new Promise((res, rej) => { resolve = res; reject = rej; });

    try {
      this.anchor.append(componentType).then(ref => {
        let instance = ref && ref.instance;
        if (!instance) {
          return reject();
        }

        instance._zIndex = ROOT_Z_INDEX;
        for (let i = 0; i < this.refs.length; i++) {
          if (this.refs[i].instance._zIndex >= ref.instance._zIndex) {
            ref.instance._zIndex = this.refs[i].instance._zIndex + 1;
          }
        }
        this.renderer.setElementAttribute(ref.location, 'role', 'dialog');

        util.extend(instance, opts);

        ref._type = overlayType;
        ref._handle = opts.handle || (overlayType + ref._z);

        this.add(ref);

        instance.close = (closeOpts={}) => {
          this.close(ref, util.extend(opts, closeOpts));
        };

        instance.onPageLoaded && instance.onPageLoaded();
        instance.onPageWillEnter && instance.onPageWillEnter();

        let animation = Animation.create(ref.location.nativeElement, opts.enterAnimation);
        if (this.config.get('animate') === false) {
          animation.duration(0);
        }
        animation.before.addClass(overlayType);
        if (overlayType == 'modal') {
          animation.before.addClass('show-page');
        }

        this.app.setEnabled(false, animation.duration());
        this.app.setTransitioning(true, animation.duration());

        this.zone.runOutsideAngular(() => {

          animation.play().then(() => {
            animation.dispose();

            this.zone.run(() => {
              this.app.setEnabled(true);
              this.app.setTransitioning(false);
              instance.onPageDidEnter && instance.onPageDidEnter();
              resolve(instance);
            });

          });

        });

      }).catch(err => {
        console.error(err);
      });

    } catch (e) {
      console.error(e);
    }

    return promise;
  }

  close(ref, opts) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    let instance = ref.instance;
    instance.onPageWillLeave && instance.onPageWillLeave();
    instance.onPageWillUnload && instance.onPageWillUnload();

    let animation = Animation.create(ref.location.nativeElement, opts.leaveAnimation);
    if (this.config.get('animate') === false) {
      animation.duration(0);
    }

    this.app.setEnabled(false, animation.duration());
    this.app.setTransitioning(true, animation.duration());

    this.zone.runOutsideAngular(() => {

      animation.play().then(() => {
        animation.dispose();

        this.zone.run(() => {
          instance.onPageDidLeave && instance.onPageDidLeave();
          instance.onPageDidUnload && instance.onPageDidUnload();

          this.app.setEnabled(true);
          this.app.setTransitioning(false);

          this.remove(ref);

          resolve();
        });

      });

    });

    return promise;
  }

  add(ref) {
    this.refs.push(ref);
  }

  remove(ref) {
    util.array.remove(this.refs, ref);
    ref.dispose && ref.dispose();
  }

  getByType(overlayType) {
    for (let i = this.refs.length - 1; i >= 0; i--) {
      if (overlayType === this.refs[i]._type) {
        return this.refs[i].instance;
      }
    }
    return null;
  }

  getByHandle(handle, overlayType) {
    for (let i = this.refs.length - 1; i >= 0; i--) {
      if (handle === this.refs[i]._handle && overlayType === this.refs[i]._type) {
        return this.refs[i].instance;
      }
    }
    return null;
  }

}


const ROOT_Z_INDEX = 1000;
