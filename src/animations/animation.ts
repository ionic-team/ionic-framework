import { CSS, nativeRaf, transitionEnd, nativeTimeout } from '../util/dom';
import { isDefined } from '../util/util';


/**
 * @private
 */
export class Animation {
  private _c: Animation[];
  private _cL: number;
  private _e: HTMLElement[];
  private _eL: number;
  private _fx: {[key: string]: EffectProperty};
  private _dur: number = null;
  private _es: string = null;
  private _bfSty: { [property: string]: any; };
  private _bfAdd: string[];
  private _bfRm: string[];
  private _afSty: { [property: string]: any; };
  private _afAdd: string[];
  private _afRm: string[];
  private _rdFn: Function[];
  private _wrFn: Function[];
  private _fFn: Function[];
  private _fOneFn: Function[];
  private _rv: boolean;
  private _unrgTrns: Function;
  private _tm: number;
  private _upd: number = 0;
  private _hasDur: boolean;
  private _isAsync: boolean;
  private _twn: boolean;
  private _raf: Function;

  parent: Animation;
  opts: AnimationOptions;
  isPlaying: boolean = false;
  hasCompleted: boolean = false;

  constructor(ele?: any, opts?: AnimationOptions, raf?: Function) {
    this.element(ele).opts = opts;
    this._raf = raf || nativeRaf;
  }

  element(ele: any): Animation {
    if (ele) {
      if (typeof ele === 'string') {
        ele = document.querySelectorAll(ele);
        for (var i = 0; i < ele.length; i++) {
          this._addEle(ele[i]);
        }

      } else if (ele.length) {
        for (var i = 0; i < ele.length; i++) {
          this._addEle(ele[i]);
        }

      } else {
        this._addEle(ele);
      }
    }

    return this;
  }

  /**
   * NO DOM
   */
  private _addEle(ele: any) {
    if (ele.nativeElement) {
      ele = ele.nativeElement;
    }

    if ((<HTMLElement>ele).nodeType === 1) {
      this._eL = (this._e = this._e || []).push(ele);
    }
  }

  /**
   * Add a child animation to this animation.
   */
  add(childAnimation: Animation): Animation {
    childAnimation.parent = this;
    this._cL = (this._c = this._c || []).push(childAnimation);
    return this;
  }

  /**
   * Get the duration of this animation. If this animation does
   * not have a duration, then it'll get the duration from its parent.
   */
  getDuration(opts?: PlayOptions): number {
    return (opts && isDefined(opts.duration) ? opts.duration : this._dur !== null ? this._dur : (this.parent && this.parent.getDuration()) || 0);
  }

  /**
   * Set the duration for this animation.
   */
  duration(milliseconds: number): Animation {
    this._dur = milliseconds;
    return this;
  }

  /**
   * Get the easing of this animation. If this animation does
   * not have an easing, then it'll get the easing from its parent.
   */
  getEasing(): string {
    return this._es !== null ? this._es : (this.parent && this.parent.getEasing()) || null;
  }

  /**
   * Set the easing for this animation.
   */
  easing(name: string): Animation {
    this._es = name;
    return this;
  }

  /**
   * Add the "from" value for a specific property.
   */
  from(prop: string, val: any): Animation {
    this._addProp('from', prop, val);
    return this;
  }

  /**
   * Add the "to" value for a specific property.
   */
  to(prop: string, val: any, clearProperyAfterTransition?: boolean): Animation {
    const fx: EffectProperty = this._addProp('to', prop, val);

    if (clearProperyAfterTransition) {
      // if this effect is a transform then clear the transform effect
      // otherwise just clear the actual property
      this.afterClearStyles([ fx.trans ? CSS.transform : prop]);
    }

    return this;
  }

  /**
   * Shortcut to add both the "from" and "to" for the same property.
   */
  fromTo(prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean): Animation {
    return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
  }

  /**
   * @private
   * NO DOM
   */
  private _addProp(state: string, prop: string, val: any): EffectProperty {
    this._fx = this._fx || {};
    let fxProp = this._fx[prop];

    if (!fxProp) {
      // first time we've see this EffectProperty
      fxProp = this._fx[prop] = {
        trans: (TRANSFORMS[prop] === 1)
      };

      // add the will-change property for transforms or opacity
      fxProp.wc = (fxProp.trans ? CSS.transform : prop);
    }

    // add from/to EffectState to the EffectProperty
    let fxState: EffectState = (<any>fxProp)[state] = {
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

  /**
   * Add CSS class to this animation's elements
   * before the animation begins.
   */
  beforeAddClass(className: string): Animation {
    (this._bfAdd = this._bfAdd || []).push(className);
    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * before the animation begins.
   */
  beforeRemoveClass(className: string): Animation {
    (this._bfRm = this._bfRm || []).push(className);
    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * before the animation begins.
   */
  beforeStyles(styles: { [property: string]: any; }): Animation {
    this._bfSty = styles;
    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * before the animation begins.
   */
  beforeClearStyles(propertyNames: string[]): Animation {
    this._bfSty = this._bfSty || {};
    for (var i = 0; i < propertyNames.length; i++) {
      this._bfSty[propertyNames[i]] = '';
    }
    return this;
  }

  /**
   * Add a function which contains DOM reads, which will run
   * before the animation begins.
   */
  beforeAddRead(domReadFn: Function): Animation {
    (this._rdFn = this._rdFn || []).push(domReadFn);
    return this;
  }

  /**
   * Add a function which contains DOM writes, which will run
   * before the animation begins.
   */
  beforeAddWrite(domWriteFn: Function): Animation {
    (this._wrFn = this._wrFn || []).push(domWriteFn);
    return this;
  }

  /**
   * Add CSS class to this animation's elements
   * after the animation finishes.
   */
  afterAddClass(className: string): Animation {
    (this._afAdd = this._afAdd || []).push(className);
    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * after the animation finishes.
   */
  afterRemoveClass(className: string): Animation {
    (this._afRm = this._afRm || []).push(className);
    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * after the animation finishes.
   */
  afterStyles(styles: { [property: string]: any; }): Animation {
    this._afSty = styles;
    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * after the animation finishes.
   */
  afterClearStyles(propertyNames: string[]): Animation {
    this._afSty = this._afSty || {};
    for (var i = 0; i < propertyNames.length; i++) {
      this._afSty[propertyNames[i]] = '';
    }
    return this;
  }

  /**
   * Play the animation.
   */
  play(opts?: PlayOptions) {
    const dur = this.getDuration(opts);

    // console.debug('Animation, play, duration', dur, 'easing', this._es);

    // this is the top level animation and is in full control
    // of when the async play() should actually kick off
    // if there is no duration then it'll set the TO property immediately
    // if there is a duration, then it'll stage all animations at the
    // FROM property and transition duration, wait a few frames, then
    // kick off the animation by setting the TO property for each animation
    this._isAsync = this._hasDuration(opts);

    // ensure all past transition end events have been cleared
    this._clearAsync();

    // recursively kicks off the correct progress step for each child animation
    this._playInit(opts);

    if (this._isAsync) {
      // for the root animation only
      // set the async TRANSITION END event
      // and run onFinishes when the transition ends
      // ******** DOM WRITE ****************
      this._asyncEnd(dur, true);
    }

    // doubling up RAFs since this animation was probably triggered
    // from an input event, and just having one RAF would have this code
    // run within the same frame as the triggering input event, and the
    // input event probably already did way too much work for one frame
    this._raf && this._raf(() => {
      this._raf && this._raf(this._playDomInspect.bind(this, opts));
    });
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _playInit(opts: PlayOptions) {
    // always default that an animation does not tween
    // a tween requires that an Animation class has an element
    // and that it has at least one FROM/TO effect
    // and that the FROM/TO effect can tween numeric values
    this._twn = false;
    this.isPlaying = true;
    this.hasCompleted = false;
    this._hasDur = (this.getDuration(opts) > ANIMATION_DURATION_MIN);

    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._playInit(opts);
    }

    if (this._hasDur) {
      // if there is a duration then we want to start at step 0
      // ******** DOM WRITE ****************
      this._progress(0);

      // add the will-change properties
      // ******** DOM WRITE ****************
      this._willChg(true);
    }
  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   * ROOT ANIMATION
   */
  _playDomInspect(opts: PlayOptions) {
    // fire off all the "before" function that have DOM READS in them
    // elements will be in the DOM, however visibily hidden
    // so we can read their dimensions if need be
    // ******** DOM READ ****************
    this._beforeReadFn();

    // ******** DOM READS ABOVE / DOM WRITES BELOW ****************

    // fire off all the "before" function that have DOM WRITES in them
    // ******** DOM WRITE ****************
    this._beforeWriteFn();

    // ******** DOM WRITE ****************
    this._playProgress(opts);

    if (this._isAsync) {
      // this animation has a duration so we need another RAF
      // for the CSS TRANSITION properties to kick in
      this._raf && this._raf(this._playToStep.bind(this, 1));
    }
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _playProgress(opts: PlayOptions) {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._playProgress(opts);
    }

    // stage all of the before css classes and inline styles
    // ******** DOM WRITE ****************
    this._before();

    if (this._hasDur) {
      // set the CSS TRANSITION duration/easing
      // ******** DOM WRITE ****************
      this._setTrans(this.getDuration(opts), false);

    } else {
      // this animation does not have a duration, so it should not animate
      // just go straight to the TO properties and call it done
      // ******** DOM WRITE ****************
      this._progress(1);

      // since there was no animation, immediately run the after
      // ******** DOM WRITE ****************
      this._after();

      // this animation has no duration, so it has finished
      // other animations could still be running
      this._didFinish(true);
    }
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _playToStep(stepValue: number) {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._playToStep(stepValue);
    }

    if (this._hasDur) {
      // browser had some time to render everything in place
      // and the transition duration/easing is set
      // now set the TO properties which will trigger the transition to begin
      // ******** DOM WRITE ****************
      this._progress(stepValue);
    }
  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   * ROOT ANIMATION
   */
  _asyncEnd(dur: number, shouldComplete: boolean) {
    var self = this;

    function onTransitionEnd(ev: any) {
      // congrats! a successful transition completed!
      // console.debug('Animation onTransitionEnd', ev.target.nodeName, ev.propertyName);

      // ensure transition end events and timeouts have been cleared
      self._clearAsync();

      // ******** DOM WRITE ****************
      self._playEnd();

      // transition finished
      self._didFinishAll(shouldComplete, true, false);
    }

    function onTransitionFallback() {
      console.debug('Animation onTransitionFallback, CSS onTransitionEnd did not fire!');
      // oh noz! the transition end event didn't fire in time!
      // instead the fallback timer when first
      // if all goes well this fallback should never fire

      // clear the other async end events from firing
      self._tm = 0;
      self._clearAsync();

      // set the after styles
      // ******** DOM WRITE ****************
      self._playEnd(1);

      // transition finished
      self._didFinishAll(shouldComplete, true, false);
    }

    // set the TRANSITION END event on one of the transition elements
    self._unrgTrns = transitionEnd(self._transEl(), onTransitionEnd);

    // set a fallback timeout if the transition end event never fires, or is too slow
    // transition end fallback: (animation duration + XXms)
    self._tm = nativeTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _playEnd(stepValue?: number) {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._playEnd(stepValue);
    }

    if (this._hasDur) {
      if (isDefined(stepValue)) {
        // too late to have a smooth animation, just finish it
        // ******** DOM WRITE ****************
        this._setTrans(0, true);

        // ensure the ending progress step gets rendered
        // ******** DOM WRITE ****************
        this._progress(stepValue);
      }

      // set the after styles
      // ******** DOM WRITE ****************
      this._after();

      // remove the will-change properties
      // ******** DOM WRITE ****************
      this._willChg(false);
    }
  }

  /**
   * @private
   * NO DOM
   * RECURSION
   */
  _hasDuration(opts: PlayOptions) {
    if (this.getDuration(opts) > ANIMATION_DURATION_MIN) {
      return true;
    }

    for (var i = 0; i < this._cL; i++) {
      if (this._c[i]._hasDuration(opts)) {
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   * NO DOM
   * RECURSION
   */
  _hasDomReads() {
    if (this._rdFn && this._rdFn.length) {
      return true;
    }

    for (var i = 0; i < this._cL; i++) {
      if (this._c[i]._hasDomReads()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Immediately stop at the end of the animation.
   */
  stop(stepValue: number = 1) {
    // ensure all past transition end events have been cleared
    this._clearAsync();
    this._hasDur = true;
    this._playEnd(stepValue);
  }

  /**
   * @private
   * NO DOM
   * NO RECURSION
   */
  _clearAsync() {
    this._unrgTrns && this._unrgTrns();
    this._tm && clearTimeout(this._tm);
    this._tm = this._unrgTrns = undefined;
  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   */
  _progress(stepValue: number) {
    // bread 'n butter
    var val: any;

    if (this._fx && this._eL) {
      // flip the number if we're going in reverse
      if (this._rv) {
        stepValue = ((stepValue * -1) + 1);
      }
      var transforms: string[] = [];

      for (var prop in this._fx) {
        var fx = this._fx[prop];

        if (fx.from && fx.to) {

          var tweenEffect = (fx.from.num !== fx.to.num);
          if (tweenEffect) {
            this._twn = true;
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
              for (var i = 0; i < this._eL; i++) {
                // ******** DOM WRITE ****************
                (<any>this._e[i].style)[prop] = val;
              }
            }
          }
        }
      }

      // place all transforms on the same property
      if (transforms.length) {
        if (!this._rv && stepValue !== 1 || this._rv && stepValue !== 0) {
          transforms.push('translateZ(0px)');
        }

        for (var i = 0; i < this._eL; i++) {
          // ******** DOM WRITE ****************
          (<any>this._e[i].style)[CSS.transform] = transforms.join(' ');
        }
      }
    }

  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   */
  _setTrans(dur: number, forcedLinearEasing: boolean) {
    // set the TRANSITION properties inline on the element
    if (this._fx) {
      const easing = (forcedLinearEasing ? 'linear' : this.getEasing());
      for (var i = 0; i < this._eL; i++) {
        if (dur > 0) {
          // ******** DOM WRITE ****************
          (<any>this._e[i].style)[CSS.transition] = '';
          (<any>this._e[i].style)[CSS.transitionDuration] = dur + 'ms';

          // each animation can have a different easing
          if (easing) {
            // ******** DOM WRITE ****************
            (<any>this._e[i].style)[CSS.transitionTimingFn] = easing;
          }
        } else {
          (<any>this._e[i].style)[CSS.transition] = 'none';
        }
      }
    }
  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   */
  _before() {
    // before the animations have started
    if (!this._rv) {
      let ele: HTMLElement;
      for (var i = 0; i < this._eL; i++) {
        ele = this._e[i];

        // css classes to add before the animation
        if (this._bfAdd) {
          for (var j = 0; j < this._bfAdd.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.add(this._bfAdd[j]);
          }
        }

        // css classes to remove before the animation
        if (this._bfRm) {
          for (var j = 0; j < this._bfRm.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.remove(this._bfRm[j]);
          }
        }

        // inline styles to add before the animation
        if (this._bfSty) {
          for (var prop in this._bfSty) {
            // ******** DOM WRITE ****************
            (<any>ele).style[prop] = this._bfSty[prop];
          }
        }
      }
    }
  }

  /**
   * @private
   * DOM READ
   * RECURSION
   */
  _beforeReadFn() {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM READ ****************
      this._c[i]._beforeReadFn();
    }

    if (this._rdFn) {
      for (var i = 0; i < this._rdFn.length; i++) {
        // ******** DOM READ ****************
        this._rdFn[i]();
      }
    }
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _beforeWriteFn() {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._beforeWriteFn();
    }

    if (this._wrFn) {
      for (var i = 0; i < this._wrFn.length; i++) {
        // ******** DOM WRITE ****************
        this._wrFn[i]();
      }
    }
  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   */
  _after() {
    let ele: HTMLElement;
    for (var i = 0; i < this._eL; i++) {
      ele = this._e[i];

      // remove the transition duration/easing
      // ******** DOM WRITE ****************
      (<any>ele).style[CSS.transitionDuration] = (<any>ele).style[CSS.transitionTimingFn] = '';

      if (this._rv) {
        // finished in reverse direction

        // css classes that were added before the animation should be removed
        if (this._bfAdd) {
          for (var j = 0; j < this._bfAdd.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.remove(this._bfAdd[j]);
          }
        }

        // css classes that were removed before the animation should be added
        if (this._bfRm) {
          for (var j = 0; j < this._bfRm.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.add(this._bfRm[j]);
          }
        }

        // inline styles that were added before the animation should be removed
        if (this._bfSty) {
          for (var prop in this._bfSty) {
            // ******** DOM WRITE ****************
            (<any>ele).style[prop] = '';
          }
        }

      } else {
        // finished in forward direction

        // css classes to add after the animation
        if (this._afAdd) {
          for (var j = 0; j < this._afAdd.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.add(this._afAdd[j]);
          }
        }

        // css classes to remove after the animation
        if (this._afRm) {
          for (var j = 0; j < this._afRm.length; j++) {
            // ******** DOM WRITE ****************
            ele.classList.remove(this._afRm[j]);
          }
        }

        // inline styles to add after the animation
        if (this._afSty) {
          for (var prop in this._afSty) {
            // ******** DOM WRITE ****************
            (<any>ele).style[prop] = this._afSty[prop];
          }
        }
      }
    }

  }

  /**
   * @private
   * DOM WRITE
   * NO RECURSION
   */
  _willChg(addWillChange: boolean) {
    let wc: string[];

    if (addWillChange) {
      wc = [];
      for (var prop in this._fx) {
        if (this._fx[prop].wc === 'webkitTransform') {
          wc.push('transform', '-webkit-transform');

        } else {
          wc.push(this._fx[prop].wc);
        }
      }
    }

    for (var i = 0; i < this._eL; i++) {
      // ******** DOM WRITE ****************
      (<any>this._e[i]).style.willChange = addWillChange ? wc.join(',') : '';
    }
  }

  /**
   * Start the animation with a user controlled progress.
   */
  progressStart() {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i].progressStart();
    }

    // ******** DOM WRITE ****************
    this._before();

    // force no duration, linear easing
    // ******** DOM WRITE ****************
    this._setTrans(0, true);

    this._willChg(true);
  }

  /**
   * Set the progress step for this animation.
   */
  progressStep(stepValue: number) {
    const now = Date.now();

    // only update if the last update was more than 16ms ago
    if (now - 15 > this._upd) {
      this._upd = now;

      stepValue = Math.min(1, Math.max(0, stepValue));

      for (var i = 0; i < this._cL; i++) {
        // ******** DOM WRITE ****************
        this._c[i].progressStep(stepValue);
      }

      if (this._rv) {
        // if the animation is going in reverse then
        // flip the step value: 0 becomes 1, 1 becomes 0
        stepValue = ((stepValue * -1) + 1);
      }

      // ******** DOM WRITE ****************
      this._progress(stepValue);
    }
  }

  /**
   * End the progress animation.
   */
  progressEnd(shouldComplete: boolean, currentStepValue: number) {
    console.debug('Animation, progressEnd, shouldComplete', shouldComplete, 'currentStepValue', currentStepValue);

    this._isAsync = (currentStepValue > 0.05 && currentStepValue < 0.95);

    const dur = 64;
    const stepValue = shouldComplete ? 1 : 0;

    this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);

    if (this._isAsync) {
      // for the root animation only
      // set the async TRANSITION END event
      // and run onFinishes when the transition ends
      // ******** DOM WRITE ****************
      this._asyncEnd(dur, true);

      // this animation has a duration so we need another RAF
      // for the CSS TRANSITION properties to kick in
      this._raf && this._raf(this._playToStep.bind(this, stepValue));
    }
  }

  /**
   * @private
   * DOM WRITE
   * RECURSION
   */
  _progressEnd(shouldComplete: boolean, stepValue: number, dur: number, isAsync: boolean) {
    for (var i = 0; i < this._cL; i++) {
      // ******** DOM WRITE ****************
      this._c[i]._progressEnd(shouldComplete, stepValue, dur, isAsync);
    }

    if (!isAsync) {
      // stop immediately
      // set all the animations to their final position
      // ******** DOM WRITE ****************
      this._progress(stepValue);
      this._willChg(false);
      this._after();
      this._didFinish(shouldComplete);

    } else {
      // animate it back to it's ending position
      this.isPlaying = true;
      this.hasCompleted = false;
      this._hasDur = true;
      // ******** DOM WRITE ****************
      this._willChg(true);
      this._setTrans(dur, false);
    }
  }

  /**
   * Add a callback to fire when the animation has finished.
   */
  onFinish(callback: Function, onceTimeCallback: boolean = false, clearOnFinishCallacks: boolean = false): Animation {
    if (clearOnFinishCallacks) {
      this._fFn = this._fOneFn = undefined;
    }
    if (onceTimeCallback) {
      this._fOneFn = this._fOneFn || [];
      this._fOneFn.push(callback);

    } else {
      this._fFn = this._fFn || [];
      this._fFn.push(callback);
    }
    return this;
  }

  /**
   * @private
   * NO DOM
   * RECURSION
   */
  _didFinishAll(hasCompleted: boolean, finishAsyncAnimations: boolean, finishNoDurationAnimations: boolean) {
    for (var i = 0; i < this._cL; i++) {
      this._c[i]._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
    }

    if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
      this._didFinish(hasCompleted);
    }
  }

  /**
   * @private
   * NO RECURSION
   */
  _didFinish(hasCompleted: boolean) {
    this.isPlaying = false;
    this.hasCompleted = hasCompleted;

    if (this._fFn) {
      // run all finish callbacks
      for (var i = 0; i < this._fFn.length; i++) {
        this._fFn[i](this);
      }
    }

    if (this._fOneFn) {
      // run all "onetime" finish callbacks
      for (var i = 0; i < this._fOneFn.length; i++) {
        this._fOneFn[i](this);
      }
      this._fOneFn.length = 0;
    }
  }

  /**
   * Reverse the animation.
   */
  reverse(shouldReverse: boolean = true): Animation {
    for (var i = 0; i < this._cL; i++) {
      this._c[i].reverse(shouldReverse);
    }
    this._rv = shouldReverse;
    return this;
  }

  /**
   * Recursively destroy this animation and all child animations.
   */
  destroy() {
    for (var i = 0; i < this._cL; i++) {
      this._c[i].destroy();
    }

    this._clearAsync();

    this.parent = this._e = this._rdFn = this._wrFn = this._raf = null;

    if (this._c) {
      this._c.length = this._cL = 0;
    }
    if (this._fFn) {
      this._fFn.length = 0;
    }
    if (this._fOneFn) {
      this._fOneFn.length = 0;
    }
  }

  /**
   * @private
   * NO DOM
   */
  _transEl(): HTMLElement {
    // get the lowest level element that has an Animation
    var targetEl: HTMLElement;

    for (var i = 0; i < this._cL; i++) {
      targetEl = this._c[i]._transEl();
      if (targetEl) {
        return targetEl;
      }
    }

    return (this._twn && this._hasDur && this._eL ? this._e[0] : null);
  }

}

export interface AnimationOptions {
  animation?: string;
  duration?: number;
  easing?: string;
  direction?: string;
  isRTL?: boolean;
  ev?: any;
}

export interface PlayOptions {
  duration?: number;
}

export interface EffectProperty {
  trans: boolean;
  wc?: string;
  to?: EffectState;
  from?: EffectState;
}

export interface EffectState {
  val: any;
  num: number;
  unit: string;
}

const TRANSFORMS: {[key: string]: number} = {
  'translateX': 1, 'translateY': 1, 'translateZ': 1, 'scale': 1, 'scaleX': 1, 'scaleY': 1, 'scaleZ': 1, 'rotate': 1, 'rotateX': 1, 'rotateY': 1, 'rotateZ': 1, 'skewX': 1, 'skewY': 1, 'perspective': 1
};

const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
const ANIMATION_DURATION_MIN = 32;
const TRANSITION_END_FALLBACK_PADDING_MS = 400;
