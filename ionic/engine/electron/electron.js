import * as util from 'ionic/util';
import {engine} from '../engine';


engine.register({
  name: 'electron',
  isMatch() {
    try {
      return util.isDefined(process) && util.isDefined(require) && util.isDefined(require('nw.gui'));
    } catch (e) {}
    return false;
  },
  ready() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  },
  fullScreen(shouldShow) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(shouldShow);
      }, 1000);
    });
  },
  showStatusBar(shouldShow) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(shouldShow);
      }, 1000);
    });
  },
  exitApp() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }
});
