import { win } from '../browser';
import { raf } from '../helpers';

import type {
  Animation,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrame,
  AnimationKeyFrameEdge,
  AnimationKeyFrames,
  AnimationLifecycle,
  AnimationPlayOptions,
} from './animation-interface';
import {
  addClassToArray,
  animationEnd,
  createKeyframeStylesheet,
  generateKeyframeName,
  generateKeyframeRules,
  processKeyframes,
  removeStyleProperty,
  setStyleProperty,
} from './animation-utils';

// TODO(FW-2832): types

interface AnimationOnFinishCallback {
  c: AnimationLifecycle;
  o?: AnimationCallbackOptions;
}

type AnimationOnStopCallback = AnimationOnFinishCallback;

/**
 * The callback used for beforeAddRead, beforeAddWrite,
 * afterAddRead, and afterAddWrite.
 */
type AnimationReadWriteCallback = () => void;

export const createAnimation = (animationId?: string): Animation => {
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
  let _commitStyles = false;
  let parentAnimation: Animation | undefined;
  let beforeStylesValue: { [property: string]: any } = {};
  let afterAddClasses: string[] = [];
  let afterRemoveClasses: string[] = [];
  let afterStylesValue: { [property: string]: any } = {};
  let numAnimationsRunning = 0;
  let shouldForceLinearEasing = false;
  let shouldForceSyncPlayback = false;
  let cssAnimationsTimerFallback: ReturnType<typeof setTimeout> | undefined;
  let forceDirectionValue: AnimationDirection | undefined;
  let forceDurationValue: number | undefined;
  let forceDelayValue: number | undefined;
  let willComplete = true;
  let finished = false;
  let shouldCalculateNumAnimations = true;
  let keyframeName: string | undefined;
  let ani: Animation;
  let paused = false;

  const id: string | undefined = animationId;
  const onFinishCallbacks: AnimationOnFinishCallback[] = [];
  const onFinishOneTimeCallbacks: AnimationOnFinishCallback[] = [];
  const onStopOneTimeCallbacks: AnimationOnStopCallback[] = [];
  const elements: HTMLElement[] = [];
  const childAnimations: Animation[] = [];
  const stylesheets: HTMLElement[] = [];
  const _beforeAddReadFunctions: AnimationReadWriteCallback[] = [];
  const _beforeAddWriteFunctions: AnimationReadWriteCallback[] = [];
  const _afterAddReadFunctions: AnimationReadWriteCallback[] = [];
  const _afterAddWriteFunctions: AnimationReadWriteCallback[] = [];
  const webAnimations: globalThis.Animation[] = [];
  const supportsAnimationEffect =
    typeof (AnimationEffect as any) === 'function' ||
    (win !== undefined && typeof (win as any).AnimationEffect === 'function');
  const supportsWebAnimations =
    typeof (Element as any) === 'function' &&
    typeof (Element as any).prototype!.animate === 'function' &&
    supportsAnimationEffect;
  const ANIMATION_END_FALLBACK_PADDING_MS = 100;

  const getWebAnimations = () => {
    return webAnimations;
  };

  const destroy = (clearStyleSheets?: boolean) => {
    childAnimations.forEach((childAnimation) => {
      childAnimation.destroy(clearStyleSheets);
    });

    cleanUp(clearStyleSheets);

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
  const cleanUp = (clearStyleSheets?: boolean) => {
    cleanUpElements();

    if (clearStyleSheets) {
      cleanUpStyleSheets();
    }
  };

  const resetFlags = () => {
    shouldForceLinearEasing = false;
    shouldForceSyncPlayback = false;
    shouldCalculateNumAnimations = true;
    forceDirectionValue = undefined;
    forceDurationValue = undefined;
    forceDelayValue = undefined;
    numAnimationsRunning = 0;
    finished = false;
    willComplete = true;
    paused = false;
  };

  const isRunning = () => {
    return numAnimationsRunning !== 0 && !paused;
  };

  /**
   * @internal
   * Remove a callback from a chosen callback array
   * @param callbackToRemove: A reference to the callback that should be removed
   * @param callbackObjects: An array of callbacks that callbackToRemove should be removed from.
   */
  const clearCallback = (
    callbackToRemove: AnimationLifecycle,
    callbackObjects: AnimationOnFinishCallback[] | AnimationOnStopCallback[]
  ) => {
    const index = callbackObjects.findIndex((callbackObject) => callbackObject.c === callbackToRemove);

    if (index > -1) {
      callbackObjects.splice(index, 1);
    }
  };

  /**
   * @internal
   * Add a callback to be fired when an animation is stopped/cancelled.
   * @param callback: A reference to the callback that should be fired
   * @param opts: Any options associated with this particular callback
   */
  const onStop = (callback: AnimationLifecycle, opts?: AnimationCallbackOptions) => {
    onStopOneTimeCallbacks.push({ c: callback, o: opts });

    return ani;
  };

  const onFinish = (callback: AnimationLifecycle, opts?: AnimationCallbackOptions) => {
    const callbacks = opts?.oneTimeCallback ? onFinishOneTimeCallbacks : onFinishCallbacks;
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
      webAnimations.forEach((animation) => {
        animation.cancel();
      });

      webAnimations.length = 0;
    } else {
      const elementsArray = elements.slice();

      raf(() => {
        elementsArray.forEach((element) => {
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
    stylesheets.forEach((stylesheet) => {
      /**
       * When sharing stylesheets, it's possible
       * for another animation to have already
       * cleaned up a particular stylesheet
       */
      if (stylesheet?.parentNode) {
        stylesheet.parentNode.removeChild(stylesheet);
      }
    });

    stylesheets.length = 0;
  };

  const beforeAddRead = (readFn: AnimationReadWriteCallback) => {
    _beforeAddReadFunctions.push(readFn);

    return ani;
  };

  const beforeAddWrite = (writeFn: AnimationReadWriteCallback) => {
    _beforeAddWriteFunctions.push(writeFn);

    return ani;
  };

  const afterAddRead = (readFn: AnimationReadWriteCallback) => {
    _afterAddReadFunctions.push(readFn);

    return ani;
  };

  const afterAddWrite = (writeFn: AnimationReadWriteCallback) => {
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
    if (_fill !== undefined) {
      return _fill;
    }
    if (parentAnimation) {
      return parentAnimation.getFill();
    }

    return 'both';
  };

  const getDirection = () => {
    if (forceDirectionValue !== undefined) {
      return forceDirectionValue;
    }
    if (_direction !== undefined) {
      return _direction;
    }
    if (parentAnimation) {
      return parentAnimation.getDirection();
    }

    return 'normal';
  };

  const getEasing = () => {
    if (shouldForceLinearEasing) {
      return 'linear';
    }
    if (_easing !== undefined) {
      return _easing;
    }
    if (parentAnimation) {
      return parentAnimation.getEasing();
    }

    return 'linear';
  };

  const getDuration = () => {
    if (shouldForceSyncPlayback) {
      return 0;
    }
    if (forceDurationValue !== undefined) {
      return forceDurationValue;
    }
    if (_duration !== undefined) {
      return _duration;
    }
    if (parentAnimation) {
      return parentAnimation.getDuration();
    }

    return 0;
  };

  const getIterations = () => {
    if (_iterations !== undefined) {
      return _iterations;
    }
    if (parentAnimation) {
      return parentAnimation.getIterations();
    }

    return 1;
  };

  const getDelay = () => {
    if (forceDelayValue !== undefined) {
      return forceDelayValue;
    }
    if (_delay !== undefined) {
      return _delay;
    }
    if (parentAnimation) {
      return parentAnimation.getDelay();
    }

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

  const commitStyles = (shouldCommitStyles: boolean = true) => {
    _commitStyles = shouldCommitStyles;

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

  const parent = (animation: Animation) => {
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

  const addAnimation = (animationToAdd: Animation | Animation[]) => {
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
    const different = _keyframes !== keyframeValues;
    _keyframes = keyframeValues;

    if (different) {
      updateKeyframes(_keyframes);
    }

    return ani;
  };

  const updateKeyframes = (keyframeValues: AnimationKeyFrames) => {
    if (supportsWebAnimations) {
      getWebAnimations().forEach((animation) => {
        /**
         * animation.effect's type is AnimationEffect.
         * However, in this case we have a more specific
         * type of AnimationEffect called KeyframeEffect which
         * inherits from AnimationEffect. As a result,
         * we cast animation.effect to KeyframeEffect.
         */
        const keyframeEffect = animation.effect as KeyframeEffect;

        /**
         * setKeyframes is not supported in all browser
         * versions that Ionic supports, so we need to
         * check for support before using it.
         */
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (keyframeEffect.setKeyframes) {
          keyframeEffect.setKeyframes(keyframeValues);
        } else {
          const newEffect = new KeyframeEffect(keyframeEffect.target, keyframeValues, keyframeEffect.getTiming());
          animation.effect = newEffect;
        }
      });
    } else {
      initializeCSSAnimation();
    }
  };

  /**
   * Run all "before" animation hooks.
   */
  const beforeAnimation = () => {
    // Runs all before read callbacks
    _beforeAddReadFunctions.forEach((callback) => callback());

    // Runs all before write callbacks
    _beforeAddWriteFunctions.forEach((callback) => callback());

    // Updates styles and classes before animation runs
    const addClasses = beforeAddClasses;
    const removeClasses = beforeRemoveClasses;
    const styles = beforeStylesValue;

    elements.forEach((el) => {
      const elementClassList = el.classList;

      addClasses.forEach((c) => elementClassList.add(c));
      removeClasses.forEach((c) => elementClassList.remove(c));

      for (const property in styles) {
        // eslint-disable-next-line no-prototype-builtins
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

    // Runs all after read callbacks
    _afterAddReadFunctions.forEach((callback) => callback());

    // Runs all after write callbacks
    _afterAddWriteFunctions.forEach((callback) => callback());

    // Updates styles and classes before animation ends
    const currentStep = willComplete ? 1 : 0;
    const addClasses = afterAddClasses;
    const removeClasses = afterRemoveClasses;
    const styles = afterStylesValue;

    elements.forEach((el) => {
      const elementClassList = el.classList;

      addClasses.forEach((c) => elementClassList.add(c));
      removeClasses.forEach((c) => elementClassList.remove(c));

      for (const property in styles) {
        // eslint-disable-next-line no-prototype-builtins
        if (styles.hasOwnProperty(property)) {
          setStyleProperty(el, property, styles[property]);
        }
      }
    });

    /**
     * Clean up any value coercion before
     * the user callbacks fire otherwise
     * they may get stale values. For example,
     * if someone calls progressStart(0) the
     * animation may still be reversed.
     */
    forceDurationValue = undefined;
    forceDirectionValue = undefined;
    forceDelayValue = undefined;

    onFinishCallbacks.forEach((onFinishCallback) => {
      return onFinishCallback.c(currentStep, ani);
    });

    onFinishOneTimeCallbacks.forEach((onFinishCallback) => {
      return onFinishCallback.c(currentStep, ani);
    });

    onFinishOneTimeCallbacks.length = 0;

    shouldCalculateNumAnimations = true;
    if (willComplete) {
      finished = true;
    }
    willComplete = true;
  };

  const animationFinish = () => {
    if (numAnimationsRunning === 0) {
      return;
    }

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

    const processedKeyframes = processKeyframes(_keyframes);
    elements.forEach((element) => {
      if (processedKeyframes.length > 0) {
        const keyframeRules = generateKeyframeRules(processedKeyframes);
        keyframeName = animationId !== undefined ? animationId : generateKeyframeName(keyframeRules);
        const stylesheet = createKeyframeStylesheet(keyframeName, keyframeRules, element);
        stylesheets.push(stylesheet);

        setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
        setStyleProperty(element, 'animation-timing-function', getEasing());
        setStyleProperty(element, 'animation-delay', `${getDelay()}ms`);
        setStyleProperty(element, 'animation-fill-mode', getFill());
        setStyleProperty(element, 'animation-direction', getDirection());

        const iterationsCount = getIterations() === Infinity ? 'infinite' : getIterations().toString();

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
    elements.forEach((element) => {
      const animation = element.animate(_keyframes, {
        id,
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection(),
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
    step = Math.min(Math.max(step, 0), 0.9999);
    if (supportsWebAnimations) {
      webAnimations.forEach((animation) => {
        // When creating the animation the delay is guaranteed to be set to a number.
        animation.currentTime = animation.effect!.getComputedTiming().delay! + getDuration() * step;
        animation.pause();

        if (_commitStyles) {
          animation.commitStyles();
        }
      });
    } else {
      const animationDuration = `-${getDuration() * step}ms`;

      elements.forEach((element) => {
        if (_keyframes.length > 0) {
          setStyleProperty(element, 'animation-delay', animationDuration);
          setStyleProperty(element, 'animation-play-state', 'paused');
        }
      });
    }
  };

  const updateWebAnimation = (step?: number) => {
    webAnimations.forEach((animation) => {
      animation.effect!.updateTiming({
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection(),
      });
    });

    if (step !== undefined) {
      setAnimationStep(step);
    }
  };

  const updateCSSAnimation = (toggleAnimationName = true, step?: number) => {
    raf(() => {
      elements.forEach((element) => {
        setStyleProperty(element, 'animation-name', keyframeName || null);
        setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
        setStyleProperty(element, 'animation-timing-function', getEasing());
        setStyleProperty(
          element,
          'animation-delay',
          step !== undefined ? `-${step! * getDuration()}ms` : `${getDelay()}ms`
        );
        setStyleProperty(element, 'animation-fill-mode', getFill() || null);
        setStyleProperty(element, 'animation-direction', getDirection() || null);

        const iterationsCount = getIterations() === Infinity ? 'infinite' : getIterations().toString();

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

  const update = (deep = false, toggleAnimationName = true, step?: number) => {
    if (deep) {
      childAnimations.forEach((animation) => {
        animation.update(deep, toggleAnimationName, step);
      });
    }

    if (supportsWebAnimations) {
      updateWebAnimation(step);
    } else {
      updateCSSAnimation(toggleAnimationName, step);
    }

    return ani;
  };

  const progressStart = (forceLinearEasing = false, step?: number) => {
    childAnimations.forEach((animation) => {
      animation.progressStart(forceLinearEasing, step);
    });

    pauseAnimation();
    shouldForceLinearEasing = forceLinearEasing;

    if (!initialized) {
      initializeAnimation();
    }
    update(false, true, step);

    return ani;
  };

  const progressStep = (step: number) => {
    childAnimations.forEach((animation) => {
      animation.progressStep(step);
    });
    setAnimationStep(step);
    return ani;
  };

  const progressEnd = (playTo: 0 | 1 | undefined, step: number, dur?: number) => {
    shouldForceLinearEasing = false;

    childAnimations.forEach((animation) => {
      animation.progressEnd(playTo, step, dur);
    });

    if (dur !== undefined) {
      forceDurationValue = dur;
    }

    finished = false;

    willComplete = true;

    if (playTo === 0) {
      forceDirectionValue = getDirection() === 'reverse' ? 'normal' : 'reverse';

      if (forceDirectionValue === 'reverse') {
        willComplete = false;
      }

      if (supportsWebAnimations) {
        update();
        setAnimationStep(1 - step);
      } else {
        forceDelayValue = (1 - step) * getDuration() * -1;
        update(false, false);
      }
    } else if (playTo === 1) {
      if (supportsWebAnimations) {
        update();
        setAnimationStep(step);
      } else {
        forceDelayValue = step * getDuration() * -1;
        update(false, false);
      }
    }

    if (playTo !== undefined && !parentAnimation) {
      play();
    }

    return ani;
  };

  const pauseAnimation = () => {
    if (initialized) {
      if (supportsWebAnimations) {
        webAnimations.forEach((animation) => {
          animation.pause();
        });
      } else {
        elements.forEach((element) => {
          setStyleProperty(element, 'animation-play-state', 'paused');
        });
      }

      paused = true;
    }
  };

  const pause = () => {
    childAnimations.forEach((animation) => {
      animation.pause();
    });

    pauseAnimation();

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
      elements.forEach((element) => {
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
        cssAnimationsTimerFallback = setTimeout(
          onAnimationEndFallback,
          animationDelay + animationDuration * animationIterations + ANIMATION_END_FALLBACK_PADDING_MS
        );
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
         */
        raf(() => {
          clearCSSAnimationPlayState();
          raf(animationFinish);
        });
      });
    }
  };

  const clearCSSAnimationPlayState = () => {
    elements.forEach((element) => {
      removeStyleProperty(element, 'animation-duration');
      removeStyleProperty(element, 'animation-delay');
      removeStyleProperty(element, 'animation-play-state');
    });
  };

  const playWebAnimations = () => {
    webAnimations.forEach((animation) => {
      animation.play();
    });

    if (_keyframes.length === 0 || elements.length === 0) {
      animationFinish();
    }
  };

  const resetAnimation = () => {
    if (supportsWebAnimations) {
      setAnimationStep(0);
      updateWebAnimation();
    } else {
      updateCSSAnimation();
    }
  };

  const play = (opts?: AnimationPlayOptions) => {
    return new Promise<void>((resolve) => {
      if (opts?.sync) {
        shouldForceSyncPlayback = true;

        onFinish(() => (shouldForceSyncPlayback = false), { oneTimeCallback: true });
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

      /**
       * When one of these callbacks fires we
       * need to clear the other's callback otherwise
       * you can potentially get these callbacks
       * firing multiple times if the play method
       * is subsequently called.
       * Example:
       * animation.play() (onStop and onFinish callbacks are registered)
       * animation.stop() (onStop callback is fired, onFinish is not)
       * animation.play() (onStop and onFinish callbacks are registered)
       * Total onStop callbacks: 1
       * Total onFinish callbacks: 2
       */
      const onStopCallback = () => {
        clearCallback(onFinishCallback, onFinishOneTimeCallbacks);
        resolve();
      };
      const onFinishCallback = () => {
        clearCallback(onStopCallback, onStopOneTimeCallbacks);
        resolve();
      };

      /**
       * The play method resolves when an animation
       * run either finishes or is cancelled.
       */
      onFinish(onFinishCallback, { oneTimeCallback: true });
      onStop(onStopCallback, { oneTimeCallback: true });

      childAnimations.forEach((animation) => {
        animation.play();
      });

      if (supportsWebAnimations) {
        playWebAnimations();
      } else {
        playCSSAnimations();
      }

      paused = false;
    });
  };

  /**
   * Stops an animation and resets it state to the
   * beginning. This does not fire any onFinish
   * callbacks because the animation did not finish.
   * However, since the animation was not destroyed
   * (i.e. the animation could run again) we do not
   * clear the onFinish callbacks.
   */
  const stop = () => {
    childAnimations.forEach((animation) => {
      animation.stop();
    });

    if (initialized) {
      cleanUpElements();
      initialized = false;
    }

    resetFlags();

    onStopOneTimeCallbacks.forEach((onStopCallback) => onStopCallback.c(0, ani));
    onStopOneTimeCallbacks.length = 0;
  };

  const from = (property: string, value: string | number) => {
    const firstFrame = _keyframes[0] as AnimationKeyFrameEdge | undefined;

    if (firstFrame !== undefined && (firstFrame.offset === undefined || firstFrame.offset === 0)) {
      firstFrame[property] = value;
    } else {
      _keyframes = [{ offset: 0, [property]: value }, ..._keyframes] as AnimationKeyFrame[];
    }

    return ani;
  };

  const to = (property: string, value: string | number) => {
    const lastFrame = _keyframes[_keyframes.length - 1] as AnimationKeyFrameEdge | undefined;

    if (lastFrame !== undefined && (lastFrame.offset === undefined || lastFrame.offset === 1)) {
      lastFrame[property] = value;
    } else {
      _keyframes = [..._keyframes, { offset: 1, [property]: value }] as AnimationKeyFrame[];
    }
    return ani;
  };

  const fromTo = (property: string, fromValue: string | number, toValue: string | number) => {
    return from(property, fromValue).to(property, toValue);
  };

  return (ani = {
    parentAnimation,
    elements,
    childAnimations,
    id,
    animationFinish,
    from,
    to,
    fromTo,
    parent,
    play,
    pause,
    stop,
    destroy,
    keyframes,
    addAnimation,
    addElement,
    update,
    commitStyles,
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
    isRunning,

    progressStart,
    progressStep,
    progressEnd,
  });
};
