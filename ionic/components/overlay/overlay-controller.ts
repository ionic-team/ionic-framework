import {Component, View, NgZone, Injectable, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@Injectable()
export class OverlayController {

  constructor(app: IonicApp, zone: NgZone, renderer: Renderer) {
    this.app = app;
    this.zone = zone;
    this.renderer = renderer;
    this.refs = [];
  }

  open(overlayType, componentType: Type, opts={}) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    if (!this.anchor) {
      console.error('<ion-overlay></ion-overlay> required in root component template to use: ' + overlayType);
      return Promise.reject();
    }

    try {
      this.anchor.append(componentType).then(ref => {
        let instance = ref.instance;

        ref._z = ROOT_Z_INDEX;
        for (let i = 0; i < this.refs.length; i++) {
          if (this.refs[i]._z >= ref._z) {
            ref._z = this.refs[i]._z + 1;
          }
        }
        this.renderer.setElementStyle(ref.location, 'zIndex', ref._z);

        util.extend(instance, opts);

        ref._type = overlayType;
        ref._opts = opts;
        ref._handle = opts.handle || (overlayType + instance.zIndex);

        this.add(ref);

        instance.close = (opts={}) => {
          this.close(ref, opts);
        };

        instance.onViewLoaded && instance.onViewLoaded();
        instance.onViewWillEnter && instance.onViewWillEnter();

        let animation = Animation.create(ref.location.nativeElement, opts.enterAnimation);
        animation.before.addClass('show-overlay');

        this.app.setEnabled(false, animation.duration());
        this.app.setTransitioning(true, animation.duration());

        this.zone.runOutsideAngular(() => {

          animation.play().then(() => {
            animation.dispose();

            this.zone.run(() => {
              this.app.setEnabled(true);
              this.app.setTransitioning(false);
              instance.onViewDidEnter && instance.onViewDidEnter();
              resolve();
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
    instance.onViewWillLeave && instance.onViewWillLeave();
    instance.onViewWillUnload && instance.onViewWillUnload();

    opts = util.extend(ref._opts, opts);
    let animation = Animation.create(ref.location.nativeElement, opts.leaveAnimation);
    animation.after.removeClass('show-overlay');

    this.app.setEnabled(false, animation.duration());
    this.app.setTransitioning(true, animation.duration());

    this.zone.runOutsideAngular(() => {

      animation.play().then(() => {
        animation.dispose();

        this.zone.run(() => {
          instance.onViewDidLeave && instance.onViewDidLeave();
          instance.onViewDidUnload && instance.onViewDidUnload();

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
    for (let i = this.overlays.length - 1; i >= 0; i--) {
      if (overlayType === this.overlays[i]._type) {
        return this.overlays[i];
      }
    }
    return null;
  }

  getByHandle(handle, overlayType) {
    for (let i = this.overlays.length - 1; i >= 0; i--) {
      if (handle === this.overlays[i]._handle && overlayType === this.overlays[i]._type) {
        return this.overlays[i];
      }
    }
    return null;
  }

}


const ROOT_Z_INDEX = 1000;
