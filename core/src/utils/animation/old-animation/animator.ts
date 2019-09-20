import { EffectProperty, EffectState, PlayOptions } from './animation-interface';
import { transitionEnd } from './transition-end';

export const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
export const DURATION_MIN = 32;
export const TRANSITION_END_FALLBACK_PADDING_MS = 400;

export const TRANSFORM_PROPS: {[key: string]: number} = {
  'translateX': 1,
  'translateY': 1,
  'translateZ': 1,

  'scale': 1,
  'scaleX': 1,
  'scaleY': 1,
  'scaleZ': 1,

  'rotate': 1,
  'rotateX': 1,
  'rotateY': 1,
  'rotateZ': 1,

  'skewX': 1,
  'skewY': 1,
  'perspective': 1
};

const win = typeof (window as any) !== 'undefined' ? window : {};
const raf = (win as any).requestAnimationFrame
  ? (win as Window).requestAnimationFrame.bind(win)
  : (f: FrameRequestCallback) => f(Date.now());

export class Animator {

  private _afterAddClasses?: string[];
  private _afterRemoveClasses?: string[];
  private _afterStyles?: { [property: string]: any; };
  private _beforeAddClasses?: string[];
  private _beforeRemoveClasses?: string[];
  private _beforeStyles?: { [property: string]: any; };
  private _childAnimations?: Animator[];
  private _duration?: number;
  private _easingName?: string;
  private _elements?: HTMLElement[];
  private _fxProperties?: EffectProperty[];
  private _hasDur = false;
  private _hasTweenEffect = false;
  private _isAsync = false;
  private _isReverse = false;
  private _onFinishCallbacks?: ((a: Animator) => void)[];
  private _onFinishOneTimeCallbacks?: ((a: Animator) => void)[];
  private _readCallbacks?: (() => void)[];
  private _reversedEasingName?: string;
  private _timerId?: any;
  private _unregisterTrnsEnd?: (() => void);
  private _writeCallbacks?: (() => void)[];
  private _destroyed = false;

  parent: Animator | undefined;
  hasChildren = false;
  isPlaying = false;
  hasCompleted = false;

  addElement(el: Node | Node[] | NodeList | undefined | null): Animator {
    if (el != null) {
      if ((el as NodeList).length > 0) {
        for (let i = 0; i < (el as NodeList).length; i++) {
          this._addEl((el as any)[i]);
        }

      } else {
        this._addEl(el);
      }
    }
    return this;
  }

  /**
   * NO DOM
   */
  private _addEl(el: any) {
    if (el.nodeType === 1) {
      (this._elements = this._elements || []).push(el);
    }
  }

  /**
   * Add a child animation to this animation.
   */
  add(childAnimation: Animator): Animator {
    childAnimation.parent = this;
    this.hasChildren = true;
    (this._childAnimations = this._childAnimations || []).push(childAnimation);
    return this;
  }

  /**
   * Get the duration of this animation. If this animation does
   * not have a duration, then it'll get the duration from its parent.
   */
  getDuration(opts?: PlayOptions): number {
    if (opts && opts.duration !== undefined) {
      return opts.duration;
    } else if (this._duration !== undefined) {
      return this._duration;
    } else if (this.parent) {
      return this.parent.getDuration();
    }
    return 0;
  }

  /**
   * Returns if the animation is a root one.
   */
  isRoot(): boolean {
    return !this.parent;
  }

  /**
   * Set the duration for this animation.
   */
  duration(milliseconds: number): Animator {
    this._duration = milliseconds;
    return this;
  }

  /**
   * Get the easing of this animation. If this animation does
   * not have an easing, then it'll get the easing from its parent.
   */
  getEasing(): string | null {
    if (this._isReverse && this._reversedEasingName !== undefined) {
      return this._reversedEasingName;
    }
    return this._easingName !== undefined ? this._easingName : (this.parent && this.parent.getEasing()) || null;
  }

  /**
   * Set the easing for this animation.
   */
  easing(name: string): Animator {
    this._easingName = name;
    return this;
  }

  /**
   * Set the easing for this reversed animation.
   */
  easingReverse(name: string): Animator {
    this._reversedEasingName = name;
    return this;
  }

  /**
   * Add the "from" value for a specific property.
   */
  from(prop: string, val: any): Animator {
    this._addProp('from', prop, val);
    return this;
  }

  /**
   * Add the "to" value for a specific property.
   */
  to(prop: string, val: any, clearProperyAfterTransition = false): Animator {
    const fx = this._addProp('to', prop, val);

    if (clearProperyAfterTransition) {
      // if this effect is a transform then clear the transform effect
      // otherwise just clear the actual property
      this.afterClearStyles(fx.trans ? ['transform', '-webkit-transform'] : [prop]);
    }

    return this;
  }

  /**
   * Shortcut to add both the "from" and "to" for the same property.
   */
  fromTo(prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean): Animator {
    return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
  }

  /**
   * NO DOM
   */

  private _getProp(name: string): EffectProperty | undefined {
    if (this._fxProperties) {
      return this._fxProperties.find(prop => prop.effectName === name);
    }
    return undefined;
  }

  private _addProp(state: string, prop: string, val: any): EffectProperty {
    let fxProp = this._getProp(prop);

    if (!fxProp) {
      // first time we've see this EffectProperty
      const shouldTrans = (TRANSFORM_PROPS[prop] === 1);
      fxProp = {
        effectName: prop,
        trans: shouldTrans,

        // add the will-change property for transforms or opacity
        wc: (shouldTrans ? 'transform' : prop)
      } as EffectProperty;
      (this._fxProperties = this._fxProperties || []).push(fxProp);
    }

    // add from/to EffectState to the EffectProperty
    const fxState: EffectState = {
      val,
      num: 0,
      effectUnit: '',
    };
    fxProp[state] = fxState;

    if (typeof val === 'string' && val.indexOf(' ') < 0) {
      const r = val.match(CSS_VALUE_REGEX);
      if (r) {
        const num = parseFloat(r[1]);

        if (!isNaN(num)) {
          fxState.num = num;
        }
        fxState.effectUnit = (r[0] !== r[2] ? r[2] : '');
      }
    } else if (typeof val === 'number') {
      fxState.num = val;
    }

    return fxProp;
  }

  /**
   * Add CSS class to this animation's elements
   * before the animation begins.
   */
  beforeAddClass(className: string): Animator {
    (this._beforeAddClasses = this._beforeAddClasses || []).push(className);
    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * before the animation begins.
   */
  beforeRemoveClass(className: string): Animator {
    (this._beforeRemoveClasses = this._beforeRemoveClasses || []).push(className);
    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * before the animation begins.
   */
  beforeStyles(styles: { [property: string]: any; }): Animator {
    this._beforeStyles = styles;
    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * before the animation begins.
   */
  beforeClearStyles(propertyNames: string[]): Animator {
    this._beforeStyles = this._beforeStyles || {};
    for (const prop of propertyNames) {
      this._beforeStyles[prop] = '';
    }
    return this;
  }

  /**
   * Add a function which contains DOM reads, which will run
   * before the animation begins.
   */
  beforeAddRead(domReadFn: () => void): Animator {
    (this._readCallbacks = this._readCallbacks || []).push(domReadFn);
    return this;
  }

  /**
   * Add a function which contains DOM writes, which will run
   * before the animation begins.
   */
  beforeAddWrite(domWriteFn: () => void): Animator {
    (this._writeCallbacks = this._writeCallbacks || []).push(domWriteFn);
    return this;
  }

  /**
   * Add CSS class to this animation's elements
   * after the animation finishes.
   */
  afterAddClass(className: string): Animator {
    (this._afterAddClasses = this._afterAddClasses || []).push(className);
    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * after the animation finishes.
   */
  afterRemoveClass(className: string): Animator {
    (this._afterRemoveClasses = this._afterRemoveClasses || []).push(className);
    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * after the animation finishes.
   */
  afterStyles(styles: { [property: string]: any; }): Animator {
    this._afterStyles = styles;
    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * after the animation finishes.
   */
  afterClearStyles(propertyNames: string[]): Animator {
    this._afterStyles = this._afterStyles || {};
    for (const prop of propertyNames) {
      this._afterStyles[prop] = '';
    }
    return this;
  }

  /**
   * Play the animation.
   */
  play(opts?: PlayOptions) {
    // If the animation was already invalidated (it did finish), do nothing
    if (this._destroyed) {
      return;
    }

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
    // ******** DOM WRITE ****************
    this._playInit(opts);

    // doubling up RAFs since this animation was probably triggered
    // from an input event, and just having one RAF would have this code
    // run within the same frame as the triggering input event, and the
    // input event probably already did way too much work for one frame
    raf(() => {
      raf(() => {
        this._playDomInspect(opts);
      });
    });
  }

  playAsync(opts?: PlayOptions): Promise<Animator> {
    return new Promise(resolve => {
      this.onFinish(resolve, { oneTimeCallback: true, clearExistingCallbacks: true });
      this.play(opts);
      return this;
    });
  }

  playSync() {
    // If the animation was already invalidated (it did finish), do nothing
    if (!this._destroyed) {
      const opts = { duration: 0 };
      this._isAsync = false;
      this._clearAsync();
      this._playInit(opts);
      this._playDomInspect(opts);
    }
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  private _playInit(opts: PlayOptions | undefined) {
    // always default that an animation does not tween
    // a tween requires that an Animation class has an element
    // and that it has at least one FROM/TO effect
    // and that the FROM/TO effect can tween numeric values
    this._hasTweenEffect = false;
    this.isPlaying = true;
    this.hasCompleted = false;
    this._hasDur = (this.getDuration(opts) > DURATION_MIN);

    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._playInit(opts);
      }
    }

    if (this._hasDur) {
      // if there is a duration then we want to start at step 0
      // ******** DOM WRITE ****************
      this._progress(0);

      // add the will-change properties
      // ******** DOM WRITE ****************
      this._willChange(true);
    }
  }

  /**
   * DOM WRITE
   * NO RECURSION
   * ROOT ANIMATION
   */
  _playDomInspect(opts: PlayOptions | undefined) {
    // fire off all the "before" function that have DOM READS in them
    // elements will be in the DOM, however visibily hidden
    // so we can read their dimensions if need be
    // ******** DOM READ ****************
    // ******** DOM WRITE ****************
    this._beforeAnimation();

    // for the root animation only
    // set the async TRANSITION END event
    // and run onFinishes when the transition ends
    const dur = this.getDuration(opts);
    if (this._isAsync) {
      this._asyncEnd(dur, true);
    }

    // ******** DOM WRITE ****************
    this._playProgress(opts);

    if (this._isAsync && !this._destroyed) {
      // this animation has a duration so we need another RAF
      // for the CSS TRANSITION properties to kick in
      raf(() => {
        this._playToStep(1);
      });
    }
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _playProgress(opts: PlayOptions | undefined) {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._playProgress(opts);
      }
    }

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
      this._setAfterStyles();

      // this animation has no duration, so it has finished
      // other animations could still be running
      this._didFinish(true);
    }
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _playToStep(stepValue: number) {
    if (!this._destroyed) {
      const children = this._childAnimations;
      if (children) {
        for (const child of children) {
          // ******** DOM WRITE ****************
          child._playToStep(stepValue);
        }
      }

      if (this._hasDur) {
        // browser had some time to render everything in place
        // and the transition duration/easing is set
        // now set the TO properties which will trigger the transition to begin
        // ******** DOM WRITE ****************
        this._progress(stepValue);
      }
    }
  }

  /**
   * DOM WRITE
   * NO RECURSION
   * ROOT ANIMATION
   */
  _asyncEnd(dur: number, shouldComplete: boolean) {
    const self = this;

    const onTransitionEnd = () => {
      // congrats! a successful transition completed!
      // ensure transition end events and timeouts have been cleared
      self._clearAsync();

      // ******** DOM WRITE ****************
      self._playEnd();

      // transition finished
      self._didFinishAll(shouldComplete, true, false);
    };

    const onTransitionFallback = () => {
      // oh noz! the transition end event didn't fire in time!
      // instead the fallback timer when first
      // if all goes well this fallback should never fire

      // clear the other async end events from firing
      self._timerId = undefined;
      self._clearAsync();

      // set the after styles
      // ******** DOM WRITE ****************
      self._playEnd(shouldComplete ? 1 : 0);

      // transition finished
      self._didFinishAll(shouldComplete, true, false);
    };

    // set the TRANSITION END event on one of the transition elements
    self._unregisterTrnsEnd = transitionEnd(self._transEl(), onTransitionEnd);

    // set a fallback timeout if the transition end event never fires, or is too slow
    // transition end fallback: (animation duration + XXms)
    self._timerId = setTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _playEnd(stepValue?: number) {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._playEnd(stepValue);
      }
    }

    if (this._hasDur) {
      if (stepValue !== undefined) {
        // too late to have a smooth animation, just finish it
        // ******** DOM WRITE ****************
        this._setTrans(0, true);

        // ensure the ending progress step gets rendered
        // ******** DOM WRITE ****************
        this._progress(stepValue);
      }

      // set the after styles
      // ******** DOM WRITE ****************
      this._setAfterStyles();

      // remove the will-change properties
      // ******** DOM WRITE ****************
      this._willChange(false);
    }
  }

  /**
   * NO DOM
   * RECURSION
   */
  _hasDuration(opts: PlayOptions | undefined) {
    if (this.getDuration(opts) > DURATION_MIN) {
      return true;
    }

    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        if (child._hasDuration(opts)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * NO DOM
   * RECURSION
   */
  _hasDomReads() {
    if (this._readCallbacks && this._readCallbacks.length > 0) {
      return true;
    }

    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        if (child._hasDomReads()) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Immediately stop at the end of the animation.
   */
  stop(stepValue = 1) {
    // ensure all past transition end events have been cleared
    this._clearAsync();
    this._hasDur = true;
    this._playEnd(stepValue);
  }

  /**
   * NO DOM
   * NO RECURSION
   */
  _clearAsync() {
    if (this._unregisterTrnsEnd) {
      this._unregisterTrnsEnd();
    }
    if (this._timerId) {
      clearTimeout(this._timerId);
    }
    this._timerId = this._unregisterTrnsEnd = undefined;
  }

  /**
   * DOM WRITE
   * NO RECURSION
   */
  _progress(stepValue: number) {
    // bread 'n butter
    let val: any;
    const elements = this._elements;
    const effects = this._fxProperties;

    if (!elements || elements.length === 0 || !effects || this._destroyed) {
      return;
    }

    // flip the number if we're going in reverse
    if (this._isReverse) {
      stepValue = 1 - stepValue;
    }
    let i = 0;
    let j = 0;
    let finalTransform = '';
    let fx: EffectProperty;

    for (i = 0; i < effects.length; i++) {
      fx = effects[i];

      if (fx.from && fx.to) {
        const fromNum = fx.from.num;
        const toNum = fx.to.num;
        const tweenEffect = (fromNum !== toNum);

        if (tweenEffect) {
          this._hasTweenEffect = true;
        }

        if (stepValue === 0) {
          // FROM
          val = fx.from.val;

        } else if (stepValue === 1) {
          // TO
          val = fx.to.val;

        } else if (tweenEffect) {
          // EVERYTHING IN BETWEEN
          const valNum = (((toNum - fromNum) * stepValue) + fromNum);
          const unit = fx.to.effectUnit;
          val = valNum + unit;
        }

        if (val !== null) {
          const prop = fx.effectName;
          if (fx.trans) {
            finalTransform += prop + '(' + val + ') ';

          } else {
            for (j = 0; j < elements.length; j++) {
              // ******** DOM WRITE ****************
              elements[j].style.setProperty(prop, val);
            }
          }
        }
      }
    }

    // place all transforms on the same property
    if (finalTransform.length > 0) {
      if (!this._isReverse && stepValue !== 1 || this._isReverse && stepValue !== 0) {
        finalTransform += 'translateZ(0px)';
      }

      for (i = 0; i < elements.length; i++) {
        // ******** DOM WRITE ****************
        elements[i].style.setProperty('transform', finalTransform);
        elements[i].style.setProperty('-webkit-transform', finalTransform);
      }
    }
  }

  /**
   * DOM WRITE
   * NO RECURSION
   */
  _setTrans(dur: number, forcedLinearEasing: boolean) {
    // Transition is not enabled if there are not effects
    const elements = this._elements;
    if (!elements || elements.length === 0 || !this._fxProperties) {
      return;
    }

    // set the TRANSITION properties inline on the element
    const easing = (forcedLinearEasing ? 'linear' : this.getEasing());
    const durString = dur + 'ms';

    for (const { style } of elements) {
      if (dur > 0) {
        // ******** DOM WRITE ****************
        style.transitionDuration = durString;

        // each animation can have a different easing
        if (easing !== null) {
          // ******** DOM WRITE ****************
          style.transitionTimingFunction = easing;
        }
      } else {
        style.transitionDuration = '0';
      }
    }
  }

  /**
   * DOM READ
   * DOM WRITE
   * RECURSION
   */
  _beforeAnimation() {
    // fire off all the "before" function that have DOM READS in them
    // elements will be in the DOM, however visibily hidden
    // so we can read their dimensions if need be
    // ******** DOM READ ****************
    this._fireBeforeReadFunc();

    // ******** DOM READS ABOVE / DOM WRITES BELOW ****************

    // fire off all the "before" function that have DOM WRITES in them
    // ******** DOM WRITE ****************
    this._fireBeforeWriteFunc();

    // stage all of the before css classes and inline styles
    // ******** DOM WRITE ****************
    this._setBeforeStyles();
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _setBeforeStyles() {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        child._setBeforeStyles();
      }
    }

    const elements = this._elements;
    // before the animations have started
    // only set before styles if animation is not reversed
    if (!elements || elements.length === 0 || this._isReverse) {
      return;
    }
    const addClasses = this._beforeAddClasses;
    const removeClasses = this._beforeRemoveClasses;

    for (const el of elements) {
      const elementClassList = el.classList;

      // css classes to add before the animation

      if (addClasses) {
        for (const c of addClasses) {
          // ******** DOM WRITE ****************
          elementClassList.add(c);
        }
      }

      // css classes to remove before the animation
      if (removeClasses) {
        for (const c of removeClasses) {
          // ******** DOM WRITE ****************
          elementClassList.remove(c);
        }
      }

      // inline styles to add before the animation
      if (this._beforeStyles) {
        for (const [key, value] of Object.entries(this._beforeStyles)) {
          // ******** DOM WRITE ****************
          el.style.setProperty(key, value);
        }
      }
    }
  }

  /**
   * DOM READ
   * RECURSION
   */
  _fireBeforeReadFunc() {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM READ ****************
        child._fireBeforeReadFunc();
      }
    }

    const readFunctions = this._readCallbacks;
    if (readFunctions) {
      for (const callback of readFunctions) {
        // ******** DOM READ ****************
        callback();
      }
    }
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _fireBeforeWriteFunc() {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._fireBeforeWriteFunc();
      }
    }

    const writeFunctions = this._writeCallbacks;
    if (writeFunctions) {
      for (const callback of writeFunctions) {
        // ******** DOM WRITE ****************
        callback();
      }
    }
  }

  /**
   * DOM WRITE
   */
  _setAfterStyles() {
    const elements = this._elements;
    if (!elements) {
      return;
    }
    for (const el of elements) {
      const elementClassList = el.classList;

      // remove the transition duration/easing
      // ******** DOM WRITE ****************
      el.style.transitionDuration = el.style.transitionTimingFunction = '';

      if (this._isReverse) {
        // finished in reverse direction

        // css classes that were added before the animation should be removed
        const beforeAddClasses = this._beforeAddClasses;
        if (beforeAddClasses) {
          for (const c of beforeAddClasses) {
            elementClassList.remove(c);
          }
        }

        // css classes that were removed before the animation should be added
        const beforeRemoveClasses = this._beforeRemoveClasses;
        if (beforeRemoveClasses) {
          for (const c of beforeRemoveClasses) {
            elementClassList.add(c);
          }
        }

        // inline styles that were added before the animation should be removed
        const beforeStyles = this._beforeStyles;
        if (beforeStyles) {
          for (const propName of Object.keys(beforeStyles)) {
            // ******** DOM WRITE ****************
            el.style.removeProperty(propName);
          }
        }

      } else {
        // finished in forward direction

        // css classes to add after the animation
        const afterAddClasses = this._afterAddClasses;
        if (afterAddClasses) {
          for (const c of afterAddClasses) {
            // ******** DOM WRITE ****************
            elementClassList.add(c);
          }
        }

        // css classes to remove after the animation
        const afterRemoveClasses = this._afterRemoveClasses;
        if (afterRemoveClasses) {
          for (const c of afterRemoveClasses) {
            // ******** DOM WRITE ****************
            elementClassList.remove(c);
          }
        }

        // inline styles to add after the animation
        const afterStyles = this._afterStyles;
        if (afterStyles) {
          for (const [key, value] of Object.entries(afterStyles)) {
            el.style.setProperty(key, value);
          }
        }
      }
    }
  }

  /**
   * DOM WRITE
   * NO RECURSION
   */
  _willChange(addWillChange: boolean) {
    let wc: string[];
    const effects = this._fxProperties;
    let willChange: string;

    if (addWillChange && effects) {
      wc = [];
      for (const effect of effects) {
        const propWC = effect.wc;
        if (propWC === 'webkitTransform') {
          wc.push('transform', '-webkit-transform');

        } else if (propWC !== undefined) {
          wc.push(propWC);
        }
      }
      willChange = wc.join(',');

    } else {
      willChange = '';
    }

    const elements = this._elements;
    if (elements) {
      for (const el of elements) {
        // ******** DOM WRITE ****************
        el.style.setProperty('will-change', willChange);
      }
    }
  }

  /**
   * Start the animation with a user controlled progress.
   */
  progressStart() {
    // ensure all past transition end events have been cleared
    this._clearAsync();

    // ******** DOM READ/WRITE ****************
    this._beforeAnimation();

    // ******** DOM WRITE ****************
    this._progressStart();
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _progressStart() {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._progressStart();
      }
    }

    // force no duration, linear easing
    // ******** DOM WRITE ****************
    this._setTrans(0, true);
    // ******** DOM WRITE ****************
    this._willChange(true);
  }

  /**
   * Set the progress step for this animation.
   * progressStep() is not debounced, so it should not be called faster than 60FPS.
   */
  progressStep(stepValue: number) {
    // only update if the last update was more than 16ms ago
    stepValue = Math.min(1, Math.max(0, stepValue));

    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child.progressStep(stepValue);
      }
    }

    // ******** DOM WRITE ****************
    this._progress(stepValue);
  }

  /**
   * End the progress animation.
   */
  progressEnd(shouldComplete: boolean, currentStepValue: number, dur = -1) {
    if (this._isReverse) {
      // if the animation is going in reverse then
      // flip the step value: 0 becomes 1, 1 becomes 0
      currentStepValue = 1 - currentStepValue;
    }
    const stepValue = shouldComplete ? 1 : 0;
    const diff = Math.abs(currentStepValue - stepValue);
    if (dur < 0) {
      dur = this._duration || 0;
    } else if (diff < 0.05) {
      dur = 0;
    }

    this._isAsync = (dur > 30);

    this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);

    if (this._isAsync) {
      // for the root animation only
      // set the async TRANSITION END event
      // and run onFinishes when the transition ends
      // ******** DOM WRITE ****************
      this._asyncEnd(dur, shouldComplete);

      // this animation has a duration so we need another RAF
      // for the CSS TRANSITION properties to kick in
      if (!this._destroyed) {
        raf(() => {
          this._playToStep(stepValue);
        });
      }
    }
  }

  /**
   * DOM WRITE
   * RECURSION
   */
  _progressEnd(shouldComplete: boolean, stepValue: number, dur: number, isAsync: boolean) {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        // ******** DOM WRITE ****************
        child._progressEnd(shouldComplete, stepValue, dur, isAsync);
      }
    }

    if (!isAsync) {
      // stop immediately
      // set all the animations to their final position
      // ******** DOM WRITE ****************
      this._progress(stepValue);
      this._willChange(false);
      this._setAfterStyles();
      this._didFinish(shouldComplete);

    } else {
      // animate it back to it's ending position
      this.isPlaying = true;
      this.hasCompleted = false;
      this._hasDur = true;

      // ******** DOM WRITE ****************
      this._willChange(true);
      this._setTrans(dur, false);
    }
  }

  /**
   * Add a callback to fire when the animation has finished.
   */
  onFinish(callback: (animation?: any) => void, opts?: {oneTimeCallback?: boolean, clearExistingCallbacks?: boolean}): Animator {
    if (opts && opts.clearExistingCallbacks) {
      this._onFinishCallbacks = this._onFinishOneTimeCallbacks = undefined;
    }
    if (opts && opts.oneTimeCallback) {
      this._onFinishOneTimeCallbacks = this._onFinishOneTimeCallbacks || [];
      this._onFinishOneTimeCallbacks.push(callback);

    } else {
      this._onFinishCallbacks = this._onFinishCallbacks || [];
      this._onFinishCallbacks.push(callback);
    }
    return this;
  }

  /**
   * NO DOM
   * RECURSION
   */
  _didFinishAll(hasCompleted: boolean, finishAsyncAnimations: boolean, finishNoDurationAnimations: boolean) {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        child._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
      }
    }

    if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
      this._didFinish(hasCompleted);
    }
  }

  /**
   * NO RECURSION
   */
  _didFinish(hasCompleted: boolean) {
    this.isPlaying = false;
    this.hasCompleted = hasCompleted;

    if (this._onFinishCallbacks) {
      // run all finish callbacks
      for (const callback of this._onFinishCallbacks) {
        callback(this);
      }
    }

    if (this._onFinishOneTimeCallbacks) {
      // run all "onetime" finish callbacks
      for (const callback of this._onFinishOneTimeCallbacks) {
        callback(this);
      }
      this._onFinishOneTimeCallbacks.length = 0;
    }
  }

  /**
   * Reverse the animation.
   */
  reverse(shouldReverse = true): Animator {
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        child.reverse(shouldReverse);
      }
    }
    this._isReverse = !!shouldReverse;
    return this;
  }

  /**
   * Recursively destroy this animation and all child animations.
   */
  destroy() {
    this._didFinish(false);
    this._destroyed = true;

    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        child.destroy();
      }
    }

    this._clearAsync();

    if (this._elements) {
      this._elements.length = 0;
    }

    if (this._readCallbacks) {
      this._readCallbacks.length = 0;
    }

    if (this._writeCallbacks) {
      this._writeCallbacks.length = 0;
    }

    this.parent = undefined;

    if (this._childAnimations) {
      this._childAnimations.length = 0;
    }
    if (this._onFinishCallbacks) {
      this._onFinishCallbacks.length = 0;
    }
    if (this._onFinishOneTimeCallbacks) {
      this._onFinishOneTimeCallbacks.length = 0;
    }
  }

  /**
   * NO DOM
   */
  _transEl(): HTMLElement | null {
    // get the lowest level element that has an Animator
    const children = this._childAnimations;
    if (children) {
      for (const child of children) {
        const targetEl = child._transEl();
        if (targetEl) {
          return targetEl;
        }
      }
    }

    return (
      this._hasTweenEffect &&
      this._hasDur &&
      this._elements !== undefined &&
      this._elements.length > 0 ?
      this._elements[0] : null
    );
  }
}
