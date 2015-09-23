import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Simple loading popup indicators.
 */
@NativePlugin({
  name: 'Loading',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-progressindicator'
  },
  pluginCheck: () => {
    return !!window.ProgressIndicator;
  }
})
export class Loading {
  static simple(dim, label, detail) {
    this.ifPlugin(() => {
      if(typeof label === 'undefined') {
        window.ProgressIndicator.showSimple(dim);
        return;
      }

      if(typeof detail === 'undefined') {
        window.ProgressIndicator.showSimpleWithLabel(dim, label);
        return;
      }

      window.ProgressIndicator.showSimpleWithLabelDetail(dim, label, detail);
    })
  }

  static determinate(dim, timeout, label) {
    this.ifPlugin(() => {
      if(typeof label === 'undefined') {
        window.ProgressIndicator.showDeterminate(dim, timeout);
        return;
      }

      if(typeof detail === 'undefined') {
        window.ProgressIndicator.showSimpleWithLabel(dim, timeout, label);
        return;
      }
    })
  }

  static annular(dim, timeout, label) {
    this.ifPlugin(() => {
      if(typeof label === 'undefined') {
        window.ProgressIndicator.showAnnular(dim, timeout);
        return;
      }

      if(typeof detail === 'undefined') {
        window.ProgressIndicator.showAnnularWithLabel(dim, timeout, label);
        return;
      }
    })
  }

  static bar(dim, timeout, label) {
    this.ifPlugin(() => {
      if(typeof label === 'undefined') {
        window.ProgressIndicator.showBar(dim, timeout);
        return;
      }

      if(typeof detail === 'undefined') {
        window.ProgressIndicator.showBarWithLabel(dim, timeout, label);
        return;
      }
    })
  }

  static success(dim, label) {
    this.ifPlugin(() => {
      window.ProgressIndicator.showSuccess(dim, label);
    })
  }

  static hide() {
    this.ifPlugin(() => {
      window.ProgressIndicator.hide();
    })
  }
}
