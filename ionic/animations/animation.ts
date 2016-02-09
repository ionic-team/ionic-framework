import {ViewController} from '../components/nav/view-controller';
import {CSS, rafFrames, raf, transitionEnd} from '../util/dom';
import {assign} from '../util/util';


/**
 * @private
 **/
export class Animation {
  private _parent: Animation;
  private _c: Array<Animation>;
  private _el: HTMLElement;
  private _opts;
  private _fx;
  private _dur: number;
  private _easing: string;
  private _bfSty;
  private _bfAdd: Array<string>;
  private _bfRmv: Array<string>;
  private _afSty;
  private _afAdd: Array<string>;
  private _afRmv: Array<string>;
  private _pFns: Array<Function>;
  private _fFns: Array<Function>;
  private _fOnceFns: Array<Function>;
  private _wChg: boolean = false;
  private _rv: boolean;

  public isPlaying: boolean;
  public hasTween: boolean;
  public meta;

  constructor(ele?, opts={}) {
    this._reset();
    this.element(ele);

    this._opts = assign({
      renderDelay: 24
    }, opts);
  }

  _reset() {
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

    this.isPlaying = this.hasTween = this._rv = false;
    this._el = this._easing = this._dur = null;
  }

  element(ele): Animation {
    if (ele) {
      if (ele.nativeElement) {
        ele = ele.nativeElement

      } else if (typeof ele === 'string') {
        ele = doc.querySelector(ele);
      }

      if (ele && ele.nodeType === 1) {
        this._el = ele;

        // does this element suport will-change property?
        this._wChg = ('opacity' in ele.style);
      }
    }
    return this;
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

  from(prop: string, val: string): Animation {
    return this._addProp('from', prop, val);
  }

  to(prop: string, val: string): Animation {
    return this._addProp('to', prop, val);
  }

  fromTo(prop: string, fromVal, toVal): Animation {
    return this.from(prop, fromVal).to(prop, toVal);
  }

  private _addProp(state: string, prop: string, val: string): Animation {
    if (!this._fx[prop]) {
      this._fx[prop] = {
        trans: (TRANSFORMS.indexOf(prop) > -1)
      }

      if (this._fx[prop].trans) {
        this._fx[prop].wc = 'transform';

      } else if (prop === 'opacity') {
        this._fx[prop].wc = prop;
      }
    }

    var fx = this._fx[prop][state] = {
      val: val,
      num: null,
      unit: '',
    };

    if (typeof val === 'string' && val.indexOf(' ') < 0) {
      let r = val.match(/(^-?\d*\.?\d*)(.*)/);
      let num = parseFloat(r[1]);

      if (!isNaN(num)) {
        fx.num = num;
      }
      fx.unit = (r[0] != r[2] ? r[2] : '');

    } else if (typeof val === 'number') {
      fx.num = val;
    }

    return this;
  }

  fadeIn(): Animation {
    return this.fromTo('opacity', 0.001, 1);
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
      setStyles: (styles): Animation => {
        this._bfSty = styles;
        return this;
      }
    }
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
      setStyles: (styles): Animation => {
        this._afSty = styles;
        return this;
      }
    }
  }

  play() {
    var self = this;

    var i, fallbackTimerId, deregTransEnd;

    console.debug('Animation, play, duration', self._dur, 'easing', self._easing);

    // always default that an animation does not tween
    // a tween requires that an Animation class has an element
    // and that it has at least one FROM/TO effect
    // and that the FROM/TO effect can tween numeric values
    self.hasTween = false;

    // fire off all the onPlays
    for (i = 0; i < self._pFns.length; i++) {
      self._pFns[i]();
    }
    this.isPlaying = true;

    // this is the top level animation and is in full control
    // of when the async play() should actually kick off
    // if there is no duration then it'll set the TO property immediately
    // if there is a duration, then it'll stage all animations at the
    // FROM property and transition duration, wait a few frames, then
    // kick off the animation by setting the TO property for each animation

    // stage all of the before css classes and inline styles
    // will recursively stage all child elements
    self._before();

    if (self._dur > 30) {
      // this animation has a duration, so it should animate
      // place all the elements with their FROM properties

      // set the FROM properties
      self._progress(0);

      self._willChange(true);

      // set the TRANSITION END event
      // and run onFinishes when the transition ends
      self._asyncEnd(self._dur);

      // begin each animation when everything is rendered in their place
      // and the transition duration/easing is ready to go
      rafFrames(self._opts.renderDelay / 16, function() {
        // there's been a moment and the elements are in place

        // now set the TRANSITION duration/easing
        self._setTrans(self._dur, false);

        // wait a few moments again to wait for the transition
        // info to take hold in the DOM
        raf(function() {
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

      // so there was no animation, immediately run the after
      self._after();

      // so there was no animation, it's done
      // fire off all the onFinishes
      self._onFinish();
    }
  }

  _asyncEnd(duration: number) {
    var self = this;
    var deregTransEnd, fallbackTimerId;

    // set the TRANSITION END event
    deregTransEnd = transitionEnd(self._transEl(), function() {
      // transition has completed
      console.debug('Animation, transition end');

      // cancel the fallback timer so it doesn't fire also
      clearTimeout(fallbackTimerId);

      // set the after styles
      self._after();
      self._willChange(false);
      self._onFinish();
    });

    // set a fallback timeout if the transition end event never fires
    fallbackTimerId = setTimeout(function() {
      // fallback timeout fired instead of the transition end
      console.debug('Animation, fallback end');

      // deregister the transition end event listener
      deregTransEnd();

      // set the after styles
      self._after();
      self._willChange(false);
      self._onFinish();

    }, duration + 300);
  }

  _progress(stepValue: number) {
    // bread 'n butter
    var i, prop, fx, val, transforms, tweenEffect;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._progress(stepValue);
    }

    if (this._el) {
      // flip the number if we're going in reverse
      if (this._rv) {
        stepValue = ((stepValue * -1) + 1);
      }
      transforms = [];

      for (prop in this._fx) {
        if (this._fx.hasOwnProperty(prop)) {
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
                this._el.style[prop] = val;
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

        this._el.style[CSS.transform] = transforms.join(' ');
      }

    }

  }

  _setTrans(duration: number, forcedLinearEasing) {
    // set the TRANSITION properties inline on the element
    for (var i = 0; i < this._c.length; i++) {
      this._c[i]._setTrans(duration, forcedLinearEasing);
    }

    if (this._el && Object.keys(this._fx).length) {
      // all parent/child animations should have the same duration
      this._el.style[CSS.transitionDuration] = duration + 'ms';

      // each animation can have a different easing
      let easing = (forcedLinearEasing ? 'linear' : this.getEasing());
      if (easing) {
        this._el.style[CSS.transitionTimingFn] = easing;
      }
    }
  }

  _willChange(addWillChange: boolean) {
    var i, wc, prop;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._willChange(addWillChange);
    }

    if (this._wChg) {

      if (addWillChange) {
        wc = [];
        for (prop in this._fx) {
          if (this._fx.hasOwnProperty(prop)) {
            if (this._fx[prop].wc !== '') {
              wc.push(this._fx[prop].wc);
            }
          }
        }
        this._el.style['willChange'] = wc.join(',');

      } else {
        this._el.style['willChange'] = '';
      }
    }
  }

  _before() {
    // before the RENDER_DELAY
    // before the animations have started
    var i, prop;

    // stage all of the child animations
    for (i = 0; i < this._c.length; i++) {
      this._c[i]._before();
    }

    if (!this._rv && this._el) {
      // css classes to add before the animation
      for (i = 0; i < this._bfAdd.length; i++) {
        this._el.classList.add(this._bfAdd[i]);
      }

      // css classes to remove before the animation
      for (i = 0; i < this._bfRmv.length; i++) {
        this._el.classList.remove(this._bfRmv[i]);
      }

      // inline styles to add before the animation
      for (prop in this._bfSty) {
        if (this._bfSty.hasOwnProperty(prop)) {
          this._el.style[prop] = this._bfSty[prop];
        }
      }
    }
  }

  _after() {
    // after the animations have finished
    var i, prop;

    for (i = 0; i < this._c.length; i++) {
      this._c[i]._after();
    }

    if (this._el) {
      // remove the transition duration/easing
      this._el.style[CSS.transitionDuration] = '';
      this._el.style[CSS.transitionTimingFn] = '';

      if (this._rv) {
        // finished in reverse direction

        // css classes that were added before the animation should be removed
        for (i = 0; i < this._bfAdd.length; i++) {
          this._el.classList.remove(this._bfAdd[i]);
        }

        // css classes that were removed before the animation should be added
        for (i = 0; i < this._bfRmv.length; i++) {
          this._el.classList.add(this._bfRmv[i]);
        }

        // inline styles that were added before the animation should be removed
        for (prop in this._bfSty) {
          if (this._bfSty.hasOwnProperty(prop)) {
            this._el.style[prop] = '';
          }
        }

      } else {
        // finished in forward direction

        // css classes to add after the animation
        for (i = 0; i < this._afAdd.length; i++) {
          this._el.classList.add(this._afAdd[i]);
        }

        // css classes to remove after the animation
        for (i = 0; i < this._afRmv.length; i++) {
          this._el.classList.remove(this._afRmv[i]);
        }

        // inline styles to add after the animation
        for (prop in this._afSty) {
          if (this._afSty.hasOwnProperty(prop)) {
            this._el.style[prop] = this._afSty[prop];
          }
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
    stepValue = Math.min(1, Math.max(0, stepValue));

    for (var i = 0; i < this._c.length; i++) {
      this._c[i].progressStep(stepValue);
    }

    if (this._rv) {
      stepValue = ((stepValue * -1) + 1);
    }
    this._progress(stepValue);
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
      this._willChange(false);
      this._onFinish();

    } else {
      // the stepValue was left off at a point when it needs to finish transition still
      // for example, the left menu was opened 75% and needs to finish opening
      this._asyncEnd(64);

      // force quick duration, linear easing
      this._setTrans(64, true);
    }
  }

  onPlay(callback: Function) {
    this._pFns.push(callback);
    return this;
  }

  onFinish(callback: Function, onceTimeCallback: boolean = false) {
    if (onceTimeCallback) {
      this._fOnceFns.push(callback);

    } else {
      this._fFns.push(callback);
    }
    return this;
  }

  _onFinish() {
    this.isPlaying = false;
    var i;

    for (i = 0; i < this._fFns.length; i++) {
      this._fFns[i]();
    }
    for (i = 0; i < this._fOnceFns.length; i++) {
      this._fOnceFns[i]();
    }
    this._fOnceFns = [];
  }

  reverse(shouldReverse: boolean = true) {
    for (var i = 0; i < this._c.length; i++) {
      this._c[i].reverse(shouldReverse);
    }
    this._rv = shouldReverse;
    return this;
  }

  destroy(removeElement?: boolean) {
    for (var i = 0; i < this._c.length; i++) {
      this._c[i].destroy(removeElement);
    }

    if (removeElement && this._el) {
      this._el.parentNode && this._el.parentNode.removeChild(this._el);
    }

    this._reset();
  }

  _transEl(): HTMLElement {
    // get the lowest level element that has an Animation
    var targetEl, i;

    for (i = 0; i < this._c.length; i++) {
      targetEl = this._c[i]._transEl();
      if (targetEl) {
        return targetEl;
      }
    }

    return (this.hasTween ? this._el : null);
  }

  /*
   STATIC CLASSES
   */
  static create(name: string): Animation {
    let AnimationClass = AnimationRegistry[name];

    if (!AnimationClass) {
      // couldn't find an animation by the given name
      // fallback to just the base Animation class
      AnimationClass = Animation;
    }
    return new AnimationClass();
  }

  static createTransition(enteringView: ViewController, leavingView: ViewController, opts: any = {}): Animation {
    let TransitionClass = AnimationRegistry[opts.animation];
    if (!TransitionClass) {
      // didn't find a transition animation, default to ios-transition
      TransitionClass = AnimationRegistry['ios-transition'];
    }

    return new TransitionClass(enteringView, leavingView, opts);
  }

  static register(name: string, AnimationClass) {
    AnimationRegistry[name] = AnimationClass;
  }

}

const doc: any = document;
const TRANSFORMS = [
  'translateX', 'translateY', 'translateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'perspective'];

let AnimationRegistry = {};
