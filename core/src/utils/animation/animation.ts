// TODO: Add more tests. until then, be sure to manually test menu and swipe to go back/routing transitions

import { raf } from '../helpers';

import { Animation, AnimationCallbackOptions, AnimationDirection, AnimationFill, AnimationKeyFrame, AnimationKeyFrames, AnimationLifecycle, AnimationPlayOptions } from './animation-interface';
import { addClassToArray, animationEnd, createKeyframeStylesheet, generateKeyframeName, generateKeyframeRules, removeStyleProperty, setStyleProperty } from './animation-utils';

interface AnimationOnFinishCallback {
  c: AnimationLifecycle;
  o?: AnimationCallbackOptions;
}

interface AnimationInternal extends Animation {
  /**
   * Sets the parent animation.
   */
  parent(animation: Animation): Animation;

  /**
   * Updates any existing animations.
   */
  update(deep: boolean): Animation;

  animationFinish(): void;
}

export const createAnimation = (): Animation => {
  let _delay: number | undefined;
  let _duration: number | undefined;
  let _easing: string | undefined;
  let _iterations: number | undefined;
  let _fill: AnimationFill | undefined;
  let _direction: AnimationDirection | undefined;
  let _keyframes: AnimationKeyFrames = [];
  let beforeAddClasses: string[] = [];
  let beforeRemoveClasses: string[] = [];
  let initialized = false;
  let parentAnimation: AnimationInternal | undefined;
  let beforeStylesValue: { [property: string]: any } = {};
  let afterAddClasses: string[] = [];
  let afterRemoveClasses: string[] = [];
  let afterStylesValue: { [property: string]: any } = {};
  let numAnimationsRunning = 0;
  let shouldForceLinearEasing = false;
  let shouldForceSyncPlayback = false;
  let cssAnimationsTimerFallback: any;
  let forceDirectionValue: AnimationDirection | undefined;
  let forceDurationValue: number | undefined;
  let forceDelayValue: number | undefined;
  let willComplete = true;
  let finished = false;
  let shouldCalculateNumAnimations = true;
  let keyframeName: string | undefined;
  let ani: AnimationInternal;

  const onFinishCallbacks: AnimationOnFinishCallback[] = [];
  const onFinishOneTimeCallbacks: AnimationOnFinishCallback[] = [];
  const elements: HTMLElement[] = [];
  const childAnimations: AnimationInternal[] = [];
  const stylesheets: HTMLElement[] = [];
  const _beforeAddReadFunctions: any[] = [];
  const _beforeAddWriteFunctions: any[] = [];
  const _afterAddReadFunctions: any[] = [];
  const _afterAddWriteFunctions: any[] = [];
  const webAnimations: any[] = [];
  const supportsAnimationEffect = (typeof (AnimationEffect as any) === 'function' || typeof (window as any).AnimationEffect === 'function');
  const supportsWebAnimations = (typeof (Element as any) === 'function') && (typeof (Element as any).prototype!.animate === 'function') && supportsAnimationEffect;
  const ANIMATION_END_FALLBACK_PADDING_MS = 100;

  const getWebAnimations = () => {
    return webAnimations;
  };

  const destroy = () => {
    childAnimations.forEach(childAnimation => {
      childAnimation.destroy();
    });

    cleanUp();

    elements.length = 0;
    childAnimations.length = 0;
    _keyframes.length = 0;

    clearOnFinish();

    initialized = false;
    shouldCalculateNumAnimations = true;

    return ani;
  };

  /**
   * Cancels any Web Animations, removes
   * any animation properties from the
   * animation's elements, and removes the
   * animation's stylesheets from the DOM.
   */
  const cleanUp = () => {
    cleanUpElements();
    cleanUpStyleSheets();
  };

  const onFinish = (callback: AnimationLifecycle, opts?: AnimationCallbackOptions) => {
    const callbacks = (opts && opts.oneTimeCallback) ? onFinishOneTimeCallbacks : onFinishCallbacks;
    callbacks.push({ c: callback, o: opts });

    return ani;
  };

  const clearOnFinish = () => {
    onFinishCallbacks.length = 0;
    onFinishOneTimeCallbacks.length = 0;

    return ani;
  };

  /**
   * Cancels any Web Animations and removes
   * any animation properties from the
   * the animation's elements.
   */
  const cleanUpElements = () => {
    if (supportsWebAnimations) {
      webAnimations.forEach(animation => {
        animation.cancel();
      });

      webAnimations.length = 0;
    } else {
      const elementsArray = elements.slice();

      raf(() => {
        elementsArray.forEach(element => {
          removeStyleProperty(element, 'animation-name');
          removeStyleProperty(element, 'animation-duration');
          removeStyleProperty(element, 'animation-timing-function');
          removeStyleProperty(element, 'animation-iteration-count');
          removeStyleProperty(element, 'animation-delay');
          removeStyleProperty(element, 'animation-play-state');
          removeStyleProperty(element, 'animation-fill-mode');
          removeStyleProperty(element, 'animation-direction');
        });
      });
    }
  };

  /**
   * Removes the animation's stylesheets
   * from the DOM.
   */
  const cleanUpStyleSheets = () => {
    stylesheets.forEach(stylesheet => {
      /**
       * When sharing stylesheets, it's possible
       * for another animation to have already
       * cleaned up a particular stylesheet
       */
      if (stylesheet && stylesheet.parentNode) {
        stylesheet.parentNode.removeChild(stylesheet);
      }
    });

    stylesheets.length = 0;
  };

  const beforeAddRead = (readFn: () => void) => {
    _beforeAddReadFunctions.push(readFn);

    return ani;
  };

  const beforeAddWrite = (writeFn: () => void) => {
    _beforeAddWriteFunctions.push(writeFn);

    return ani;
  };

  const afterAddRead = (readFn: () => void) => {
    _afterAddReadFunctions.push(readFn);

    return ani;
  };

  const afterAddWrite = (writeFn: () => void) => {
    _afterAddWriteFunctions.push(writeFn);

    return ani;
  };

  const beforeAddClass = (className: string | string[] | undefined) => {
    beforeAddClasses = addClassToArray(beforeAddClasses, className);

    return ani;
  };

  const beforeRemoveClass = (className: string | string[] | undefined) => {
    beforeRemoveClasses = addClassToArray(beforeRemoveClasses, className);

    return ani;
  };

  /**
   * Set CSS inline styles to the animation's
   * elements before the animation begins.
   */
  const beforeStyles = (styles: { [property: string]: any } = {}) => {
    beforeStylesValue = styles;
    return ani;
  };

  /**
   * Clear CSS inline styles from the animation's
   * elements before the animation begins.
   */
  const beforeClearStyles = (propertyNames: string[] = []) => {
    for (const property of propertyNames) {
      beforeStylesValue[property] = '';
    }

    return ani;
  };

  const afterAddClass = (className: string | string[] | undefined) => {
    afterAddClasses = addClassToArray(afterAddClasses, className);

    return ani;
  };

  const afterRemoveClass = (className: string | string[] | undefined) => {
    afterRemoveClasses = addClassToArray(afterRemoveClasses, className);

    return ani;
  };

  const afterStyles = (styles: { [property: string]: any } = {}) => {
    afterStylesValue = styles;

    return ani;
  };

  const afterClearStyles = (propertyNames: string[] = []) => {
    for (const property of propertyNames) {
      afterStylesValue[property] = '';
    }

    return ani;
  };

  const getFill = () => {
    if (_fill !== undefined) { return _fill; }
    if (parentAnimation) { return parentAnimation.getFill(); }

    return 'both';
  };

  const getDirection = () => {
    if (forceDirectionValue !== undefined) { return forceDirectionValue; }
    if (_direction !== undefined) { return _direction; }
    if (parentAnimation) { return parentAnimation.getDirection(); }

    return 'normal';

  };

  const getEasing = () => {
    if (shouldForceLinearEasing) { return 'linear'; }
    if (_easing !== undefined) { return _easing; }
    if (parentAnimation) { return parentAnimation.getEasing(); }

    return 'linear';
  };

  const getDuration = () => {
    if (shouldForceSyncPlayback) { return 0; }
    if (forceDurationValue !== undefined) { return forceDurationValue; }
    if (_duration !== undefined) { return _duration; }
    if (parentAnimation) { return parentAnimation.getDuration(); }

    return 0;
  };

  const getIterations = () => {
    if (_iterations !== undefined) { return _iterations; }
    if (parentAnimation) { return parentAnimation.getIterations(); }

    return 1;
  };

  const getDelay = () => {
    if (forceDelayValue !== undefined) { return forceDelayValue; }
    if (_delay !== undefined) { return _delay; }
    if (parentAnimation) { return parentAnimation.getDelay(); }

    return 0;
  };

  const getKeyframes = () => {
    return _keyframes;
  };

  const direction = (animationDirection: AnimationDirection) => {
    _direction = animationDirection;

    update(true);

    return ani;
  };

  const fill = (animationFill: AnimationFill) => {
    _fill = animationFill;

    update(true);

    return ani;
  };

  const delay = (animationDelay: number) => {
    _delay = animationDelay;

    update(true);

    return ani;
  };

  const easing = (animationEasing: string) => {
    _easing = animationEasing;

    update(true);

    return ani;
  };

  const duration = (animationDuration: number) => {
    /**
     * CSS Animation Durations of 0ms work fine on Chrome
     * but do not run on Safari, so force it to 1ms to
     * get it to run on both platforms.
     */
    if (!supportsWebAnimations && animationDuration === 0) {
      animationDuration = 1;
    }

    _duration = animationDuration;

    update(true);

    return ani;
  };

  const iterations = (animationIterations: number) => {
    _iterations = animationIterations;

    update(true);

    return ani;
  };

  const parent = (animation: AnimationInternal) => {
    parentAnimation = animation;

    return ani;
  };

  const addElement = (el: Element | Element[] | Node | Node[] | NodeList | undefined | null) => {
    if (el != null) {

      if ((el as Node).nodeType === 1) {
        elements.push(el as any);
      } else if ((el as NodeList).length >= 0) {
        for (let i = 0; i < (el as NodeList).length; i++) {
          elements.push((el as any)[i]);
        }
      } else {
        console.error('Invalid addElement value');
      }
    }

    return ani;
  };

  const addAnimation = (animationToAdd: AnimationInternal | AnimationInternal[]) => {
    if ((animationToAdd as any) != null) {
      if (Array.isArray(animationToAdd)) {
        for (const animation of animationToAdd) {
          animation.parent(ani);
          childAnimations.push(animation);
        }
      } else {
        animationToAdd.parent(ani);
        childAnimations.push(animationToAdd);
      }
    }
    return ani;
  };

  const keyframes = (keyframeValues: AnimationKeyFrames) => {
    _keyframes = keyframeValues;

    return ani;
  };

  /**
   * Runs all before read callbacks
   */
  const runBeforeRead = () => {
    _beforeAddReadFunctions.forEach(callback => {
      callback();
    });
  };

  /**
   * Runs all before write callbacks
   */
  const runBeforeWrite = () => {
    _beforeAddWriteFunctions.forEach(callback => {
      callback();
    });
  };

  /**
   * Updates styles and classes before animation runs
   */
  const runBeforeStyles = () => {
    const addClasses = beforeAddClasses;
    const removeClasses = beforeRemoveClasses;
    const styles = beforeStylesValue;

    elements.forEach(el => {
      const elementClassList = el.classList;

      addClasses.forEach(c => elementClassList.add(c));
      removeClasses.forEach(c => elementClassList.remove(c));

      for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
          setStyleProperty(el, property, styles[property]);
        }
      }
    });
  };

  /**
   * Run all "before" animation hooks.
   */
  const beforeAnimation = () => {
    runBeforeRead();
    runBeforeWrite();
    runBeforeStyles();
  };

  /**
   * Runs all after read callbacks
   */
  const runAfterRead = () => {
    _afterAddReadFunctions.forEach(callback => {
      callback();
    });
  };

  /**
   * Runs all after write callbacks
   */
  const runAfterWrite = () => {
    _afterAddWriteFunctions.forEach(callback => {
      callback();
    });
  };

  /**
   * Updates styles and classes before animation ends
   */
  const runAfterStyles = () => {
    const addClasses = afterAddClasses;
    const removeClasses = afterRemoveClasses;
    const styles = afterStylesValue;

    elements.forEach(el => {
      const elementClassList = el.classList;

      addClasses.forEach(c => elementClassList.add(c));
      removeClasses.forEach(c => elementClassList.remove(c));

      for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
          setStyleProperty(el, property, styles[property]);
        }
      }
    });
  };

  /**
   * Run all "after" animation hooks.
   */
  const afterAnimation = () => {
    clearCSSAnimationsTimeout();
    runAfterRead();
    runAfterWrite();
    runAfterStyles();

    const currentStep = willComplete ? 1 : 0;

    onFinishCallbacks.forEach(onFinishCallback => {
      return onFinishCallback.c(currentStep, ani);
    });

    onFinishOneTimeCallbacks.forEach(onFinishCallback => {
      return onFinishCallback.c(currentStep, ani);
    });

    onFinishOneTimeCallbacks.length = 0;

    shouldCalculateNumAnimations = true;
    finished = true;
  };

  const animationFinish = () => {
    if (numAnimationsRunning === 0) { return; }

    numAnimationsRunning--;

    if (numAnimationsRunning === 0) {
      afterAnimation();
      if (parentAnimation) {
        parentAnimation.animationFinish();
      }
    }
  };

  const initializeCSSAnimation = (toggleAnimationName = true) => {
    cleanUpStyleSheets();

    elements.forEach(element => {
      if (_keyframes.length > 0) {
        const keyframeRules = generateKeyframeRules(_keyframes);
        keyframeName = generateKeyframeName(keyframeRules);
        const stylesheet = createKeyframeStylesheet(keyframeName, keyframeRules, element);
        stylesheets.push(stylesheet);

        setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
        setStyleProperty(element, 'animation-timing-function', getEasing());
        setStyleProperty(element, 'animation-delay', `${getDelay()}ms`);
        setStyleProperty(element, 'animation-fill-mode', getFill());
        setStyleProperty(element, 'animation-direction', getDirection());

        const iterationsCount = (getIterations() === Infinity)
          ? 'infinite'
          : getIterations().toString();

        setStyleProperty(element, 'animation-iteration-count', iterationsCount);
        setStyleProperty(element, 'animation-play-state', 'paused');

        if (toggleAnimationName) {
          setStyleProperty(element, 'animation-name', `${stylesheet.id}-alt`);
        }

        raf(() => {
          setStyleProperty(element, 'animation-name', stylesheet.id || null);
        });
      }
    });
  };

  const initializeWebAnimation = () => {
    elements.forEach(element => {
      const animation = element.animate(_keyframes, {
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection()
      });

      animation.pause();

      webAnimations.push(animation);
    });

    if (webAnimations.length > 0) {
      webAnimations[0].onfinish = () => {
        animationFinish();
      };
    }

  };

  const initializeAnimation = (toggleAnimationName = true) => {
    beforeAnimation();

    if (_keyframes.length > 0) {
      if (supportsWebAnimations) {
        initializeWebAnimation();
      } else {
        initializeCSSAnimation(toggleAnimationName);
      }
    }

    initialized = true;
  };

  const setAnimationStep = (step: number) => {
    step = Math.min(Math.max(step, 0), 0.999);
    if (supportsWebAnimations) {
      webAnimations.forEach(animation => {
        animation.currentTime = animation.effect.getComputedTiming().delay + (getDuration()! * step);
        animation.pause();
      });

    } else {
      const animationDelay = getDelay() || 0;
      const animationDuration = `-${animationDelay + (getDuration()! * step)}ms`;

      elements.forEach(element => {
        if (_keyframes.length > 0) {
          setStyleProperty(element, 'animation-delay', animationDuration);
          setStyleProperty(element, 'animation-play-state', 'paused');
        }
      });
    }
  };

  const updateWebAnimation = () => {
    webAnimations.forEach(animation => {
      animation.effect.updateTiming({
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection()
      });
    });
  };

  const updateCSSAnimation = (toggleAnimationName = true) => {
    raf(() => {
      elements.forEach(element => {
        setStyleProperty(element, 'animation-name', keyframeName || null);
        setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
        setStyleProperty(element, 'animation-timing-function', getEasing());
        setStyleProperty(element, 'animation-delay', `${getDelay()}ms`);
        setStyleProperty(element, 'animation-fill-mode', getFill() || null);
        setStyleProperty(element, 'animation-direction', getDirection() || null);

        const iterationsCount = (getIterations() === Infinity)
          ? 'infinite'
          : getIterations().toString();

        setStyleProperty(element, 'animation-iteration-count', iterationsCount);

        if (toggleAnimationName) {
          setStyleProperty(element, 'animation-name', `${keyframeName}-alt`);
        }

        raf(() => {
          setStyleProperty(element, 'animation-name', keyframeName || null);
        });
      });
    });
  };

  const update = (deep = false, toggleAnimationName = true) => {
    if (deep) {
      childAnimations.forEach(animation => {
        animation.update(deep);
      });
    }

    if (supportsWebAnimations) {
      updateWebAnimation();
    } else {
      updateCSSAnimation(toggleAnimationName);
    }

    return ani;
  };

  const progressStart = (forceLinearEasing = false) => {
    childAnimations.forEach(animation => {
      animation.progressStart(forceLinearEasing);
    });

    pauseAnimation();
    shouldForceLinearEasing = forceLinearEasing;

    if (!initialized) {
      initializeAnimation();
    } else {
      update();
      setAnimationStep(0);
    }

    return ani;
  };

  const progressStep = (step: number) => {
    childAnimations.forEach(animation => {
      animation.progressStep(step);
    });
    setAnimationStep(step);
    return ani;
  };

  const progressEnd = (playTo: 0 | 1 | undefined, step: number, dur?: number) => {
    shouldForceLinearEasing = false;

    childAnimations.forEach(animation => {
      animation.progressEnd(playTo, step, dur);
    });

    if (dur !== undefined) {
      forceDurationValue = dur;
    }

    finished = false;

    willComplete = playTo === 1;

    if (!willComplete) {
      forceDirectionValue = (getDirection() === 'reverse') ? 'normal' : 'reverse';

      if (supportsWebAnimations) {
        update();
        setAnimationStep(1 - step);
      } else {
        forceDelayValue = ((1 - step) * getDuration()!) * -1;
        update(false, false);
      }
    } else {
      if (!supportsWebAnimations) {
        forceDelayValue = (step * getDuration()!) * -1;
        update(false, false);
      }
    }

    onFinish(() => {
      willComplete = true;
      forceDurationValue = undefined;
      forceDirectionValue = undefined;
      forceDelayValue = undefined;
    }, {
      oneTimeCallback: true
    });

    if (!parentAnimation) {
      play();
    }

    return ani;
  };

  const pauseAnimation = () => {
    if (initialized) {
      if (supportsWebAnimations) {
        webAnimations.forEach(animation => {
          animation.pause();
        });
      } else {
        elements.forEach(element => {
          setStyleProperty(element, 'animation-play-state', 'paused');
        });
      }
    }
  };

  const pause = () => {
    childAnimations.forEach(animation => {
      animation.pause();
    });

    pauseAnimation();

    return ani;
  };

  const playAsync = () => {
    return play();
  };

  const playSync = () => {
    play({ sync: true });

    return ani;
  };

  const onAnimationEndFallback = () => {
    cssAnimationsTimerFallback = undefined;
    animationFinish();
  };

  const clearCSSAnimationsTimeout = () => {
    if (cssAnimationsTimerFallback) {
      clearTimeout(cssAnimationsTimerFallback);
    }
  };

  const playCSSAnimations = () => {
    clearCSSAnimationsTimeout();

    raf(() => {
      elements.forEach(element => {
        if (_keyframes.length > 0) {
          setStyleProperty(element, 'animation-play-state', 'running');
        }
      });
    });

    if (_keyframes.length === 0 || elements.length === 0) {
       animationFinish();
    } else {
      /**
       * This is a catchall in the event that a CSS Animation did not finish.
       * The Web Animations API has mechanisms in place for preventing this.
       * CSS Animations will not fire an `animationend` event
       * for elements with `display: none`. The Web Animations API
       * accounts for this, but using raw CSS Animations requires
       * this workaround.
       */
       const animationDelay = getDelay() || 0;
       const animationDuration = getDuration() || 0;
       const animationIterations = getIterations() || 1;

       // No need to set a timeout when animation has infinite iterations
       if (isFinite(animationIterations)) {
        cssAnimationsTimerFallback = setTimeout(onAnimationEndFallback, animationDelay + (animationDuration * animationIterations) + ANIMATION_END_FALLBACK_PADDING_MS);
       }

       animationEnd(elements[0], () => {
        clearCSSAnimationsTimeout();

        /**
         * Ensure that clean up
         * is always done a frame
         * before the onFinish handlers
         * are fired. Otherwise, there
         * may be flickering if a new
         * animation is started on the same
         * element too quickly
         *
         * TODO: Is there a cleaner way to do this?
         */
        raf(() => {
          clearCSSAnimationPlayState();
          raf(animationFinish);
        });
      });
    }
  };

  const clearCSSAnimationPlayState = () => {
    elements.forEach(element => {
      removeStyleProperty(element, 'animation-duration');
      removeStyleProperty(element, 'animation-delay');
      removeStyleProperty(element, 'animation-play-state');
    });
  };

  const playWebAnimations = () => {
    webAnimations.forEach(animation => {
      animation.play();
    });

    if (_keyframes.length === 0 || elements.length === 0) {
      animationFinish();
    }
  };

  const resetAnimation = () => {
    if (supportsWebAnimations) {
      setAnimationStep(0);
    } else {
      updateCSSAnimation();
    }
  };

  const play = (opts?: AnimationPlayOptions) => {
    return new Promise<void>(resolve => {
      if (opts && opts.sync) {
        shouldForceSyncPlayback = true;

        onFinish(() => shouldForceSyncPlayback = false, { oneTimeCallback: true });
      }
      if (!initialized) {
        initializeAnimation();
      }

      if (finished) {
        resetAnimation();
        finished = false;
      }

      if (shouldCalculateNumAnimations) {
        numAnimationsRunning = childAnimations.length + 1;
        shouldCalculateNumAnimations = false;
      }

      onFinish(() => resolve(), { oneTimeCallback: true });

      childAnimations.forEach(animation => {
        animation.play();
      });

      if (supportsWebAnimations) {
        playWebAnimations();
      } else {
        playCSSAnimations();
      }
    });
  };

  const stop = () => {
    childAnimations.forEach(animation => {
      animation.stop();
    });

    if (initialized) {
      cleanUpElements();
      initialized = false;
    }
  };

  const from = (property: string, value: any) => {
    const firstFrame = _keyframes[0] as AnimationKeyFrame | undefined;

    if (firstFrame !== undefined && firstFrame.offset === 0) {
      firstFrame[property] = value;
    } else {
      _keyframes = [
        { offset: 0, [property]: value },
        ..._keyframes
      ];
    }

    return ani;
  };

  const to = (property: string, value: any) => {
    const lastFrame = _keyframes[_keyframes.length - 1] as AnimationKeyFrame | undefined;

    if (lastFrame !== undefined && lastFrame.offset === 1) {
      lastFrame[property] = value;
    } else {
      _keyframes = [
        ..._keyframes,
        { offset: 1, [property]: value }
      ];
    }
    return ani;
  };

  const fromTo = (property: string, fromValue: any, toValue: any) => {
    return from(property, fromValue).to(property, toValue);
  };

  return ani = {
    parentAnimation,
    elements,
    childAnimations,
    animationFinish,
    from,
    to,
    fromTo,
    parent,
    play,
    playAsync,
    playSync,
    pause,
    stop,
    destroy,
    keyframes,
    addAnimation,
    addElement,
    update,
    fill,
    direction,
    iterations,
    duration,
    easing,
    delay,
    getWebAnimations,
    getKeyframes,
    getFill,
    getDirection,
    getDelay,
    getIterations,
    getEasing,
    getDuration,
    afterAddRead,
    afterAddWrite,
    afterClearStyles,
    afterStyles,
    afterRemoveClass,
    afterAddClass,
    beforeAddRead,
    beforeAddWrite,
    beforeClearStyles,
    beforeStyles,
    beforeRemoveClass,
    beforeAddClass,
    onFinish,

    progressStart,
    progressStep,
    progressEnd
  };
};
