import {Injectable} from 'angular2/core';

import {ViewController} from '../nav/view-controller';
import {Config} from '../../config/config';
import {IonicApp} from '../app/app';


@Injectable()
export class OverlayController {

  constructor(private _config: Config) {}

  push(overlayView, opts={}) {
    overlayView.setNav(this._nav);
    opts.animateFirst = true;

    return new Promise(resolve => {
      this._nav.pushView(overlayView, opts, resolve);
    });
  }

  pop(opts={}) {
    opts.animateFirst = true;
    return this._nav.pop(opts);
  }

  setNav(nav) {
    this._nav = nav;
  }

}
