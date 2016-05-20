import {CSS, rafFrames, transitionEnd, nativeTimeout} from '../util/dom';
import {assign, isDefined} from '../util/util';


/**
 * @private
 **/
export class Animation {
  private _parent: Animation;
  private _c: Animation[];
  private _el: HTMLElement[];
  private _opts: AnimationOptions;
  private _fx: {[key: string]: EffectProperty};
  private _dur: number;
  private _easing: string;
  private _bfSty: { [property: string]: any; };
  private _bfAdd: string[];
  private _bfRmv: string[];
  private _afSty: { [property: string]: any; };
  private _afAdd: string[];
  private _afRmv: string[];
  private _pFns: Function[];
  private _fFns: Function[];
  private _fOnceFns: Function[];
  private _wChg: boolean = false;
  private _rv: boolean = false;
  private _unregTrans: Function;
  private _tmr: number;
  private _lastUpd: number = 0;

  public isPlaying: boolean = false;
  public hasTween: boolean = false;
  public hasCompleted: boolean = false;

  constructor(ele?: any, opts: AnimationOptions = {}) {
    this._reset();
    this.element(ele);

    this._opts = assign({
      renderDelay: 24
    }, opts);
  }

  _reset() {
    this._el = [];
    this._c = [];
    this._fx = {};

    this._bfSty = {};
    this._bfAdd = [];
    this._bfRmv = [];
    this._afSty = {};
    this._afAdd = [];
    this._afRmv = [];

    this._pFns = [];
    this._fFns = [];
    this._fOnceFns = [];

    this._easing = this._dur = null;
  }

  element(ele: any): Animation {
    var i: number;

    if (ele) {
      if (Array.isArray(ele)) {
        for (i = 0; i < ele.length; i++) {
          this._addEle(ele[i]);
        }

      } else if (typeof ele === 'string') {
        ele = document.querySelectorAll(ele);
        for (i = 0; i < ele.length; i++) {
          this._addEle(ele[i]);
        }

      } else {
        this._addEle(ele);
      }
    }

    return this;
  }

  private _addEle(ele: any) {
    if (ele.nativeElement) {
      ele = ele.nativeElement;
    }

    if (ele.nodeType === 1) {
      this._el.push(ele);

      // does this element suport will-change property?
      this._wChg = (typeof ele.style.willChange !== 'undefined');
    }
  }

  parent(parentAnimation: Animation): Animation {
    this._parent = parentAnimation;
    return this;
  }

  add(childAnimation: Animation): Animation {
    childAnimation.parent(this);
    this._c.push(childAnimation);
    return this;
  }

  getDuration(): number {
    return this._dur !== null ? this._dur : (this._parent && this._parent.getDuration()) || 0;
  }

  duration(milliseconds: number): Animation {
    this._dur = milliseconds;
    return this;
  }

  getEasing(): string {
    return this._easing !== null ? this._easing : (this._parent && this._parent.getEasing()) || null;
  }

  easing(name: string): Animation {
    this._easing = name;
    return this;
  }

  from(prop: string, val: any): Animation {
    this._addProp('from', prop, val);
    return this;
  }

  to(prop: string, val: any, clearProperyAfterTransition?: boolean): Animation {
    var fx: EffectProperty = this._addProp('to', prop, val);

    if (clearProperyAfterTransition) {
      // if this effect is a transform then clear the transform effect
      // otherwise just clear the actual property
      this.after.clearStyles([ fx.trans ? CSS.transform : prop]);
    }

    return this;
  }

  fromTo(prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean): Animation {
    return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
  }

  private _addProp(state: string, prop: string, val: any): EffectProperty {
    var fxProp: EffectProperty = this._fx[prop];

    if (!fxProp) {
      // first time we've see this EffectProperty
      fxProp = this._fx[prop] = {
        trans: (typeof TRANSFORMS[prop] !== 'undefined'),
        wc: ''
      };

      // add the will-change property fo transforms or opacity
      if (fxProp.trans) {
        fxProp.wc = CSS.transform;

      } else if (prop === 'opacity') {
        fxProp.wc = prop;
      }
    }

    // add from/to EffectState to the EffectProperty
    var fxState = fxProp[state] = {
      val: val,
      num: null,
      unit: '',
    };

    if (typeof val === 'string' && val.indexOf(' ') < 0) {
      let r = val.match(CSS_VALUE_REGEX);
      let num = parseFloat(r[1]);

      if (!isNaN(num)) {
        fxState.num = num;
      }
      fxState.unit = (r[0] !== r[2] ? r[2] : '');

    } else if (typeof val === 'number') {
      fxState.num = val;
    }

    return fxProp;
  }

  fadeIn(): Animation {
    return this.fromTo('opacity', 0.001, 1, true);
  }

  fadeOut(): Animation {
    return this.fromTo('opacity', 0.999, 0);
  }

  get before() {
    return {
      addClass: (className: string): Animation => {
        this._bfAdd.push(className);
        return this;
      },
      removeClass: (className: string): Animation => {
        this._bfRmv.push(className);
        return this;
      },
      setStyles: (styles: { [property: string]: any; }): Animation => {
        this._bfSty = styles;
        return this;
      },
      clearStyles: (propertyNames: string[]): Animation => {
        for (var i = 0; i < propertyNames.length; i++) {
          this._bfSty[propertyNames[i]] = '';
        }
        return this;
      }
    };
  }

  get after() {
    return {
      addClass: (className: string): Animation => {
        this._afAdd.push(className);
        return this;
      },
      removeClass: (className: string): Animation => {
        this._afRmv.push(className);
        return this;
      },
      setStyles: (styles: { [property: string]: any; }): Animation => {
        this._afSty = styles;
        return this;
      },
      clearStyles: (propertyNames: string[]): Animation => {
        for (var i = 0; i < propertyNames.length; i++) {
          this._afSty[propertyNames[i]] = '';
        }
        return this;
      }
    };
  }

  play(opts: PlayOptions = {}) {
    var self = this;
    var i: number;
    var duration: number = isDefined(opts.duration) ? opts.duration : self._dur;

    console.debug('Animation, play, duration', duration, 'easing', self._easing);

    // always default that an animation does not tween
    // a tween requires that an Animation class has an element
    // and that it has at least one FROM/TO effect
    // and that the FROM/TO effect can tween numeric values
    self.hasTween = false;
    self.hasCompleted = false;

    // fire off all the onPlays
    for (i = 0; i < self._pFns.length; i++) {
      self._pFns[i]();
    }
    self.isPlaying = true;

    // this is the top level animation and is in full control
    // of when the async play() should actually kick off
    // if there is no duration then it'll set the TO property immediately
    // if there is a duration, then it'll stage all animations at the
    // FROM property and transition duration, wait a few frames, then
    // kick off the animation by setting the TO property for each animation

    // stage all of the before css classes and inline styles
    // will recursively stage all child elements
    self._before();

    // ensure all past transition end events have been cleared
    self._clearAsync();

    if (duration > 30) {
      // this animation has a duration, so it should animate
      // place all the elements with their FROM properties

      // set the FROM properties
      self._progress(0);

      // add the will-change or translateZ properties when applicable
      self._willChg(true);

      // set the async TRANSITION END event
      // and run onFinishes when the transition ends
      self._asyncEnd(duration, true);

      // begin each animation when everything is rendered in their place
      // and the transition duration/easing is ready to go
      rafFrames(self._opts.renderDelay / 16, function() {
        // there's been a moment and the elements are in place

        // now set the TRANSITION duration/easing
        self._setTrans(duration, false);

        // wait a few moments again to wait for the transition
        // info to take hold in the DOM
        rafFrames(2, function() {
          // browser had some time to render everything in place
          // and the transition duration/easing is set
          // now set the TO properties
          // which will trigger the transition to begin
          self._progress(1);
        });

      });

    } else {
      // this animation does not have a duration, so it should not animate
      // just go straight to the TO properties and call it done
      self._progress(1);

      // since there was no animation, immediately run the after
      self._after();

      // since there was no animation, it's done
      // fire off all the onFinishes
      self._didFinish(true);
    }
  }

  stop(opts: PlayOptions = {}) {
    var self = this;
    var duration = isDefined(opts.duration) ? opts.duration : 0;
    var stepValue = isDefined(opts.stepValue) ? opts.stepValue : 1;

    // ensure all past transition end events have been cleared
    this._clearAsync();

    // set the TO properties
    self._progress(stepValue);

    if (duration > 30) {
      // this animation has a duration, so it should animate
      // place all the elements with their TO properties

      // now set the TRANSITION duration
      self._setTrans(duration, true);

      // set the async TRANSITION END event
      // and run onFinishes when the transition ends
      self._asyncEnd(duration, false);

    } else {
      // this animation does not have a duration, so it should not animate
      // just go straight to the TO properties and call it done
      self._after();

      // since there was no animation, it's done
      // fire off all the onFinishes
      self._didFinish(false);
    }
  }

  _asyncEnd(duration: number, shouldComplete: boolean) {
    var self = this;

    function onTransitionEnd(ev) {
      console.debug('Animation onTransitionEnd', ev.target.nodeName, ev.propertyName);

      // ensure transition end events and timeouts have been cleared
      self._clearAsync();

      // set the after styles
      self._after();

      // remove will change properties
      self._willChg(false);

      // transition finished
      self._didFinish(shouldComplete);
    }

    function onTransitionFallback() {
      console.debug('Animation onTransitionFallback');
      // oh noz! the transition end event didn't fire in time!
      // instead the fallback timer when first

      // clear the other async end events from firing
      self._tmr = 0;
      self._clearAsync();

      // too late to have a smooth animation, just finish it
      self._setTrans(0, true);

      // ensure the ending progress step gets rendered
      self._progress(1);

      // set the after styles
      self._after();

      // remove will change properties
      self._willChg(false);

      // transition finished
      self._didFinish(shouldComplete);
    }

    // set the TRANSITION END event on one of the transition elements
    self._unregTrans = transitionEnd(self._transEl(), onTransitionEnd);

    // set a fallback timeout if the transition end event never fires, or is too slow
    // transition end fallback: (animation duration + XXms)
    self._tmr = nativeTimeout(onTransitionFallback, duration + 400);
  }

  _clearAsync() {
    this._unregTrans && this._unregTrans();
    if (this._tmr) {
      clearTimeout(this._tmr);
      this._tmr = 0;
    }
  }

  _progress(stepValue: number) {
    // bread 'n butter
    var i: number;
    var prop: string;
    var fx: EffectProperty;
    var val: any;
    var transforms: string[];
    var tweenEffect: boolean;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._progress(stepValue);
    }

    if (this._el.length) {
      // flip the number if we're going in reverse
      if (this._rv) {
        stepValue = ((stepValue * -1) + 1);
      }
      transforms = [];

      for (prop in this._fx) {
        fx = this._fx[prop];

        if (fx.from && fx.to) {

          tweenEffect = (fx.from.num !== fx.to.num);
          if (tweenEffect) {
            this.hasTween = true;
          }

          if (stepValue === 0) {
            // FROM
            val = fx.from.val;

          } else if (stepValue === 1) {
            // TO
            val = fx.to.val;

          } else if (tweenEffect) {
            // EVERYTHING IN BETWEEN
            val = (((fx.to.num - fx.from.num) * stepValue) + fx.from.num) + fx.to.unit;

          } else {
            val = null;
          }

          if (val !== null) {
            if (fx.trans) {
              transforms.push(prop + '(' + val + ')');

            } else {
              for (i = 0; i < this._el.length; i++) {
                this._el[i].style[prop] = val;
              }
            }
          }
        }

      }

      // place all transforms on the same property
      if (transforms.length) {
        if (!this._wChg) {
          // if the element doesn't support will-change
          // then auto add translateZ for transform properties
          transforms.push('translateZ(0px)');
        }

        for (i = 0; i < this._el.length; i++) {
          this._el[i].style[CSS.transform] = transforms.join(' ');
        }
      }

    }

  }

  _setTrans(duration: number, forcedLinearEasing: boolean) {
    var i: number;
    var easing: string;

    // set the TRANSITION properties inline on the element
    for (i = 0; i < this._c.length; i++) {
      this._c[i]._setTrans(duration, forcedLinearEasing);
    }

    if (Object.keys(this._fx).length) {
      for (i = 0; i < this._el.length; i++) {
        // all parent/child animations should have the same duration
        this._el[i].style[CSS.transitionDuration] = duration + 'ms';

        // each animation can have a different easing
        easing = (forcedLinearEasing ? 'linear' : this.getEasing());
        if (easing) {
          this._el[i].style[CSS.transitionTimingFn] = easing;
        }
      }
    }
  }

  _willChg(addWillChange: boolean) {
    var i: number;
    var wc: string[];
    var prop: string;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._willChg(addWillChange);
    }

    if (this._wChg) {
      wc = [];

      if (addWillChange) {
        for (prop in this._fx) {
          if (this._fx[prop].wc !== '') {
            wc.push(this._fx[prop].wc);
          }
        }
      }

      for (i = 0; i < this._el.length; i++) {
        this._el[i].style['willChange'] = wc.join(',');
      }
    }
  }

  _before() {
    // before the RENDER_DELAY
    // before the animations have started
    var i: number;
    var j: number;
    var prop: string;
    var ele: HTMLElement;

    // stage all of the child animations
    for (i = 0; i < this._c.length; i++) {
      this._c[i]._before();
    }

    if (!this._rv) {
      for (i = 0; i < this._el.length; i++) {
        ele = this._el[i];

        // css classes to add before the animation
        for (j = 0; j < this._bfAdd.length; j++) {
          ele.classList.add(this._bfAdd[j]);
        }

        // css classes to remove before the animation
        for (j = 0; j < this._bfRmv.length; j++) {
          ele.classList.remove(this._bfRmv[j]);
        }

        // inline styles to add before the animation
        for (prop in this._bfSty) {
          ele.style[prop] = this._bfSty[prop];
        }
      }
    }
  }

  _after() {
    // after the animations have finished
    var i: number;
    var j: number;
    var prop: string;
    var ele: HTMLElement;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._after();
    }

    for (i = 0; i < this._el.length; i++) {
      ele = this._el[i];

      // remove the transition duration/easing
      ele.style[CSS.transitionDuration] = '';
      ele.style[CSS.transitionTimingFn] = '';

      if (this._rv) {
        // finished in reverse direction

        // css classes that were added before the animation should be removed
        for (j = 0; j < this._bfAdd.length; j++) {
          ele.classList.remove(this._bfAdd[j]);
        }

        // css classes that were removed before the animation should be added
        for (j = 0; j < this._bfRmv.length; j++) {
          ele.classList.add(this._bfRmv[j]);
        }

        // inline styles that were added before the animation should be removed
        for (prop in this._bfSty) {
          ele.style[prop] = '';
        }

      } else {
        // finished in forward direction

        // css classes to add after the animation
        for (j = 0; j < this._afAdd.length; j++) {
          ele.classList.add(this._afAdd[j]);
        }

        // css classes to remove after the animation
        for (j = 0; j < this._afRmv.length; j++) {
          ele.classList.remove(this._afRmv[j]);
        }

        // inline styles to add after the animation
        for (prop in this._afSty) {
          ele.style[prop] = this._afSty[prop];
        }
      }
    }

  }

  progressStart() {
    for (var i = 0; i < this._c.length; i++) {
      this._c[i].progressStart();
    }

    this._before();

    // force no duration, linear easing
    this._setTrans(0, true);
  }

  progressStep(stepValue: number) {
    let now = Date.now();

    // only update if the last update was more than 16ms ago
    if (now - 16 > this._lastUpd) {
      this._lastUpd = now;

      stepValue = Math.min(1, Math.max(0, stepValue));

      for (var i = 0; i < this._c.length; i++) {
        this._c[i].progressStep(stepValue);
      }

      if (this._rv) {
        // if the animation is going in reverse then
        // flip the step value: 0 becomes 1, 1 becomes 0
        stepValue = ((stepValue * -1) + 1);
      }

      this._progress(stepValue);
    }
  }

  progressEnd(shouldComplete: boolean, currentStepValue: number) {
    console.debug('Animation, progressEnd, shouldComplete', shouldComplete, 'currentStepValue', currentStepValue);

    for (var i = 0; i < this._c.length; i++) {
      this._c[i].progressEnd(shouldComplete, currentStepValue);
    }

    // set all the animations to their final position
    this._progress(shouldComplete ? 1 : 0);

    // if it's already at the final position, or close, then it's done
    // otherwise we need to add a transition end event listener
    if (currentStepValue < 0.05 || currentStepValue > 0.95) {
      // the progress was already left off at the point that is finished
      // for example, the left menu was dragged all the way open already
      this._after();
      this._willChg(false);
      this._didFinish(shouldComplete);

    } else {
      // the stepValue was left off at a point when it needs to finish transition still
      // for example, the left menu was opened 75% and needs to finish opening
      this._asyncEnd(64, shouldComplete);

      // force quick duration, linear easing
      this._setTrans(64, true);
    }
  }

  onPlay(callback: Function): Animation {
    this._pFns.push(callback);
    return this;
  }

  onFinish(callback: Function, onceTimeCallback: boolean = false, clearOnFinishCallacks: boolean = false): Animation {
    if (clearOnFinishCallacks) {
      this._fFns = [];
      this._fOnceFns = [];
    }
    if (onceTimeCallback) {
      this._fOnceFns.push(callback);

    } else {
      this._fFns.push(callback);
    }
    return this;
  }

  _didFinish(hasCompleted: boolean) {
    this.isPlaying = false;
    this.hasCompleted = hasCompleted;
    var i: number;

    for (i = 0; i < this._fFns.length; i++) {
      this._fFns[i](this);
    }
    for (i = 0; i < this._fOnceFns.length; i++) {
      this._fOnceFns[i](this);
    }
    this._fOnceFns = [];
  }

  reverse(shouldReverse: boolean = true): Animation {
    for (var i = 0; i < this._c.length; i++) {
      this._c[i].reverse(shouldReverse);
    }
    this._rv = shouldReverse;
    return this;
  }

  destroy(removeElement?: boolean) {
    var i: number;
    var ele: HTMLElement;

    for (i = 0; i < this._c.length; i++) {
      this._c[i].destroy(removeElement);
    }

    if (removeElement) {
      for (i = 0; i < this._el.length; i++) {
        ele = this._el[i];
        ele.parentNode && ele.parentNode.removeChild(ele);
      }
    }

    this._clearAsync();
    this._reset();
  }

  _transEl(): HTMLElement {
    // get the lowest level element that has an Animation
    var i: number;
    var targetEl: HTMLElement;

    for (i = 0; i < this._c.length; i++) {
      targetEl = this._c[i]._transEl();
      if (targetEl) {
        return targetEl;
      }
    }

    return (this.hasTween && this._el.length ? this._el[0] : null);
  }

  /*
   STATIC CLASSES
   */
  static create(name: string, opts: AnimationOptions = {}): Animation {
    let AnimationClass = AnimationRegistry[name];

    if (!AnimationClass) {
      // couldn't find an animation by the given name
      // fallback to just the base Animation class
      AnimationClass = Animation;
    }
    return new AnimationClass(null, opts);
  }

  static register(name: string, AnimationClass) {
    AnimationRegistry[name] = AnimationClass;
  }

}

export interface AnimationOptions {
  animation?: string;
  renderDelay?: number;
}

export interface PlayOptions {
  duration?: number;
  stepValue?: number;
}

interface EffectProperty {
  trans: boolean;
  wc: string;
  to?: EffectState;
  from?: EffectState;
}

interface EffectState {
  val: any;
  num: number;
  unit: string;
}

const TRANSFORMS = {
  'translateX': 1, 'translateY': 1, 'translateZ': 1,
  'scale': 1, 'scaleX': 1, 'scaleY': 1, 'scaleZ': 1,
  'rotate': 1, 'rotateX': 1, 'rotateY': 1, 'rotateZ': 1,
  'skewX': 1, 'skewY': 1, 'perspective': 1
};

const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;

let AnimationRegistry = {};
