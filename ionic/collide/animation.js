import {Collide} from './collide'
import {animationStart} from './animation-start'
import {animationStop} from './animation-stop'
import {startTick} from './tick'


export class Animation {
  constructor() {
    this._elements = null;
    this._options = {};
    this._properties = {};
  }

  elements(ele) {
    if (!ele) {
      this._elements = null;
    } else {
      this._elements = !ele.length ? [ele] : ele;
    }
  }


  /*************
     Actions
  *************/

  start() {
    let promise = animationStart(this._elements, this._options, this._properties);

    startTick();

    return promise;
  }

  stop() {
    animationStop(this._elements, this._options, this._properties);
  }

  percent(ratio) {
    this._options.percentComplete = parseFloat(ratio);
    animationStart(this._elements, this._options, this._properties);
  }


  /***********************
     Options
  ***********************/
  options(val) {
    this._options = val || {};
  }

  option(key, val) {
    this._options[key] = val;
  }

  removeOption(key) {
    delete this._options[key];
  }

  duration(val) {
    this._options.duration = val;
  }

  easing(val) {
    this._options.easing = val;
  }


  /**************************
     Properties
  **************************/

  properties(val) {
    this._properties = val || {};
  }

  property(key, val) {
    this._properties[key] = val;
  }

  removeProperty(key) {
    delete this._properties[key];
  }


  /**************************
     Misc
  **************************/

  debug(val) {
    Collide.debug = !!val;
  }

}
