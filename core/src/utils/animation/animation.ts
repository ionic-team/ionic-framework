import { Animation, AnimationDirection, AnimationFill } from './animation-interface';
import { addClassToArray, animationEnd, createKeyframeStylesheet, generateKeyframeName, generateKeyframeRules, removeStyleProperty, setStyleProperty } from './animation-utils';

export const createAnimation = () => {
  let _delay: number | undefined;
  let _duration: number | undefined;
  let _easing: string | undefined;
  let _iterations: number | undefined;
  let _fill: AnimationFill | undefined;
  let _direction: AnimationDirection | undefined;
  let _keyframes: any[] = [];
  let beforeAddClasses: string[] = [];
  let beforeRemoveClasses: string[] = [];
  let initialized = false;
  let parentAnimation: Animation | undefined;
  let beforeStylesValue: { [property: string]: any } = {};
  let afterAddClasses: string[] = [];
  let afterRemoveClasses: string[] = [];
  let afterStylesValue: { [property: string]: any } = {};
  let numAnimationsRunning = 0;
  let shouldForceLinearEasing = false;
  let shouldForceSyncPlayback = false;
  let shouldForceReverseDirection = false;
  let willComplete = true;
  let shouldCalculateNumAnimations = true;
  let keyframeName: string;
  let ani: Animation;

  const elements: HTMLElement[] = [];
  const childAnimations: Animation[] = [];
  const stylesheets: HTMLElement[] = [];
  const _beforeAddReadFunctions: any[] = [];
  const _beforeAddWriteFunctions: any[] = [];
  const _afterAddReadFunctions: any[] = [];
  const _afterAddWriteFunctions: any[] = [];
  const webAnimations: any[] = [];
  const onFinishCallbacks: any[] = [];
  const supportsWebAnimations = (typeof (window as any).Animation === 'function');

  /**
   * Returns the raw Web Animations object
   * for all elements in an Animation.
   * This will return an empty array on
   * browsers that do not support
   * the Web Animations API.
   */
  const getWebAnimations = () => {
    return webAnimations;
  };

  /**
   * Destroy the animation and all child animations.
   */
  const destroy = () => {
    cleanUp();

    elements.length = 0;
    childAnimations.length = 0;
    onFinishCallbacks.length = 0;

    initialized = false;

    childAnimations.forEach(childAnimation => {
      childAnimation.destroy();
    });

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

  /**
   * Add a callback to be run
   * upon the animation ending
   */
  const onFinish = (callback: any) => {
    onFinishCallbacks.push(callback);

    return ani;
  };

  /**
   * Cancels any Web Animations and removes
   * any animation properties from the
   * the animation's elements.
   */
  const cleanUpElements = () => {
    if (supportsWebAnimations) {
      getWebAnimations().forEach(animation => {
        animation.cancel();
      });

      webAnimations.length = 0;
    } else {
      elements.forEach(element => {
        removeStyleProperty(element, 'animation-name');
        removeStyleProperty(element, 'animation-duration');
        removeStyleProperty(element, 'animation-timing-function');
        removeStyleProperty(element, 'animation-iteration-count');
        removeStyleProperty(element, 'animation-delay');
        removeStyleProperty(element, 'animation-play-state');
        removeStyleProperty(element, 'animation-fill-mode');
        removeStyleProperty(element, 'animation-direction');
      });
    }
  };

  /**
   * Removes the animation's stylesheets
   * from the DOM.
   */
  const cleanUpStyleSheets = () => {
    stylesheets.forEach(stylesheet => {
      stylesheet.parentNode!.removeChild(stylesheet);
    });

    stylesheets.length = 0;
  };

  /**
   * Add a function that performs a
   * DOM read to be run before the
   * animation starts
   */
  const beforeAddRead = (readFn: () => void) => {
    _beforeAddReadFunctions.push(readFn);

    return ani;
  };

  /**
   * Add a function that performs a
   * DOM write to be run before the
   * animation starts
   */
  const beforeAddWrite = (writeFn: () => void) => {
    _beforeAddWriteFunctions.push(writeFn);

    return ani;
  };

  /**
   * Add a function that performs a
   * DOM read to be run after the
   * animation end
   */
  const afterAddRead = (readFn: () => void) => {
    _afterAddReadFunctions.push(readFn);

    return ani;
  };

  /**
   * Add a function that performs a
   * DOM write to be run after the
   * animation end
   */
  const afterAddWrite = (writeFn: () => void) => {
    _afterAddWriteFunctions.push(writeFn);

    return ani;
  };

  /**
   * Add a class to the animation's
   * elements before the animation starts
   */
  const beforeAddClass = (className: string | string[] | undefined) => {
    beforeAddClasses = addClassToArray(beforeAddClasses, className);

    return ani;
  };

  /**
   * Remove a class from the animation's
   * elements before the animation starts
   */
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

  /**
   * Add CSS class to the animation's
   * elements after the animation ends.
   */
  const afterAddClass = (className: string | string[] | undefined) => {
    afterAddClasses = addClassToArray(afterAddClasses, className);

    return ani;
  };

  /**
   * Remove CSS class from the animation's
   * elements after the animation ends.
   */
  const afterRemoveClass = (className: string | string[] | undefined) => {
    afterRemoveClasses = addClassToArray(afterRemoveClasses, className);

    return ani;
  };

  /**
   * Set CSS inline styles to the animation's
   * elements after the animation ends.
   */
  const afterStyles = (styles: { [property: string]: any } = {}) => {
    afterStylesValue = styles;

    return ani;
  };

  /**
   * Clear CSS inline styles from the animation's
   * elements after the animation ends.
   */
  const afterClearStyles = (propertyNames: string[] = []) => {
    for (const property of propertyNames) {
      afterStylesValue[property] = '';
    }

    return ani;
  };

  /**
   * Returns the animation's fill mode.
   */
  const getFill = () => {
    if (_fill !== undefined) { return _fill; }
    if (parentAnimation) { return parentAnimation.getFill(); }

    return undefined;
  };

  /**
   * Returns the animation's direction.
   */
  const getDirection = () => {
    if (shouldForceReverseDirection) { return 'reverse'; }
    if (_direction !== undefined) { return _direction; }
    if (parentAnimation) { return parentAnimation.getDirection(); }

    return undefined;

  };

  /**
   * Returns the animation's easing.
   */
  const getEasing = () => {
    if (shouldForceLinearEasing) { return 'linear'; }
    if (_easing !== undefined) { return _easing; }
    if (parentAnimation) { return parentAnimation.getEasing(); }

    return undefined;
  };

  /**
   * Gets the animation's duration in milliseconds.
   */
  const getDuration = () => {
    if (shouldForceSyncPlayback) { return 0; }
    if (_duration !== undefined) { return _duration; }
    if (parentAnimation) { return parentAnimation.getDuration(); }

    return undefined;
  };

  /**
   * Gets the number of iterations the animation will run.
   */
  const getIterations = () => {
    if (_iterations !== undefined) { return _iterations; }
    if (parentAnimation) { return parentAnimation.getIterations(); }

    return undefined;
  };

  /**
   * Gets the animation's delay in milliseconds.
   */
  const getDelay = () => {
    if (_delay !== undefined) { return _delay; }
    if (parentAnimation) { return parentAnimation.getDelay(); }

    return undefined;
  };

  /**
   * Get an array of keyframes for the animation.
   */
  const getKeyframes = () => {
    return _keyframes;
  };

  /**
   * Sets whether the animation should play forwards,
   * backwards, or alternating back and forth.
   */
  const direction = (animationDirection: AnimationDirection) => {
    _direction = animationDirection;

    return ani;
  };

  /**
   * Sets how the animation applies styles to its
   * elements before and after the animation's execution.
   */
  const fill = (animationFill: AnimationFill) => {
    _fill = animationFill;

    return ani;

  };

  /**
   * Sets when an animation starts (in milliseconds).
   */
  const delay = (animationDelay: number) => {
    _delay = animationDelay;

    return ani;
  };

  /**
   * Sets how the animation progresses through the
   * duration of each cycle.
   */
  const easing = (animationEasing: string) => {
    _easing = animationEasing;

    return ani;
  };

  /**
   * Sets the length of time the animation takes
   * to complete one cycle.
   */
  const duration = (animationDuration: number) => {
    _duration = animationDuration;

    return ani;
  };

  /**
   * Sets the number of times the animation cycle
   * should be played before stopping.
   */
  const iterations = (animationIterations: number) => {
    _iterations = animationIterations;

    return ani;
  };

  /**
   * Sets the parent animation.
   */
  const parent = (animation: Animation) => {
    parentAnimation = animation;

    return ani;
  };

  /**
   * Add one or more elements to the animation
   */
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

  /**
   * Group one or more animations together to be controlled by a parent animation.
   */
  const addAnimation = (animationToAdd: Animation | Animation[] | undefined | null) => {
    if (animationToAdd != null) {
      const parentAnim = ani;
      const animationsToAdd = animationToAdd as Animation[];
      if (animationsToAdd.length >= 0) {
        for (const animation of animationsToAdd) {
          animation.parent(parentAnim);
          childAnimations.push(animation);
        }
      } else {
        (animationToAdd as Animation).parent(parentAnim);
        childAnimations.push(animationToAdd as Animation);
      }
    }

    return ani;
  };

  /**
   * Set the keyframes for the animation.
   */
  const keyframes = (keyframeValues: any[]) => {
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

    elements.forEach((el: HTMLElement) => {
      const elementClassList = el.classList;

      elementClassList.add(...addClasses);
      elementClassList.remove(...removeClasses);

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

    elements.forEach((el: HTMLElement) => {
      const elementClassList = el.classList;

      elementClassList.add(...addClasses);
      elementClassList.remove(...removeClasses);

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
    runAfterRead();
    runAfterWrite();
    runAfterStyles();

    const didComplete = willComplete;

    onFinishCallbacks.forEach(callback => {
      callback(didComplete, ani);
    });

    shouldCalculateNumAnimations = true;
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

  const initializeCSSAnimation = () => {
    cleanUpStyleSheets();

    elements.forEach(element => {
      if (_keyframes.length > 0) {
        const keyframeRules = generateKeyframeRules(_keyframes);
        keyframeName = generateKeyframeName(keyframeRules);
        const stylesheet = createKeyframeStylesheet(keyframeName, keyframeRules, element);
        stylesheets.push(stylesheet);

        setStyleProperty(element, 'animation-name', stylesheet.id || null);
        setStyleProperty(element, 'animation-duration', (getDuration() !== undefined) ? `${getDuration()}ms` : null);
        setStyleProperty(element, 'animation-timing-function', getEasing() || null);
        setStyleProperty(element, 'animation-delay', (getDelay() !== undefined) ? `${getDelay()}ms` : null);
        setStyleProperty(element, 'animation-fill-mode', getFill() || null);
        setStyleProperty(element, 'animation-direction', getDirection() || null);

        const iterationsCount =
          (getIterations() !== undefined) ?
          (getIterations() === Infinity) ? 'infinite' : getIterations()!.toString()
          : null;

        setStyleProperty(element, 'animation-iteration-count', iterationsCount);
        setStyleProperty(element, 'animation-play-state', 'paused');
      }
    });

    if (elements.length > 0) {
      animationEnd(elements[0], () => {
        animationFinish();
      });
    }
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

    if (getWebAnimations().length > 0) {
      webAnimations[0].onfinish = () => {
        animationFinish();
      };
    }

  };

  const initializeAnimation = () => {
    beforeAnimation();

    if (_keyframes.length > 0) {
      if (supportsWebAnimations) {
        initializeWebAnimation();
      } else {
        initializeCSSAnimation();
      }
    }

    initialized = true;
  };

  const progressStep = (step: number) => {
    childAnimations.forEach(animation => {
      animation.progressStep(step);
    });

    step = Math.min(Math.max(step, 0), 0.99);

    if (getDuration() !== undefined) {
      if (supportsWebAnimations) {
        getWebAnimations().forEach(animation => {
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
    }

    return ani;
  };

  const updateWebAnimation = () => {
    getWebAnimations().forEach(animation => {
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

  const updateCSSAnimation = (restart: boolean = false) => {
    elements.forEach(element => {
            
      if (restart) {
        element.style.setProperty('animation', 'none');
        void element.offsetHeight;
        element.style.removeProperty('animation');
      }
      
      setStyleProperty(element, 'animation-name', keyframeName || null);
      setStyleProperty(element, 'animation-duration', (getDuration() !== undefined) ? `${getDuration()}ms` : null);
      setStyleProperty(element, 'animation-timing-function', getEasing() || null);
      setStyleProperty(element, 'animation-delay', (getDelay() !== undefined) ? `${getDelay()}ms` : null);
      setStyleProperty(element, 'animation-fill-mode', getFill() || null);
      setStyleProperty(element, 'animation-direction', getDirection() || null);

      const iterationsCount =
        (getIterations() !== undefined) ?
        (getIterations() === Infinity) ? 'infinite' : getIterations()!.toString()
        : null;

      setStyleProperty(element, 'animation-iteration-countion', iterationsCount);
    });
  };

  const removeCSSAnimation = () => {
    elements.forEach(element => {
      removeStyleProperty(element, 'animation-name');
      removeStyleProperty(element, 'animation-duration');
      removeStyleProperty(element, 'animation-timing-function');
      removeStyleProperty(element, 'animation-delay');
      removeStyleProperty(element, 'animation-fill-mode');
      removeStyleProperty(element, 'animation-direction');
      removeStyleProperty(element, 'animation-iteration-countion');
      removeStyleProperty(element, 'animation-play-state');
    });
  };

  /**
   * Updates any existing animations.
   */
  const update = (deep = false) => {
    if (deep) {
      childAnimations.forEach(animation => {
        animation.update(deep);
      });
    }

    if (supportsWebAnimations) {
      updateWebAnimation();
    } else {
      updateCSSAnimation();
    }
    
    return ani;
  };

  const progressStart = (forceLinearEasing = false) => {
    childAnimations.forEach(animation => {
      animation.progressStart(forceLinearEasing);
    });

    shouldForceLinearEasing = forceLinearEasing;

    initializeAnimation();

    return ani;
  };

  const progressEnd = (shouldComplete: boolean, step: number) => {
    childAnimations.forEach(animation => {
      animation.progressEnd(shouldComplete, step);
    });

    step = Math.min(Math.max(step, 0), 0.99);

    shouldForceLinearEasing = false;
    willComplete = shouldComplete;

    if (!shouldComplete) {
      onFinish(() => {
        willComplete = true;
        shouldForceReverseDirection = false;
        removeCSSAnimation();
      });

      shouldForceReverseDirection = true;
      update();
      progressStep(1 - step);
    }

    if (!parentAnimation) {
      play();
    }

    return ani;
  };

  /**
   * Pause the animation.
   */
  const pause = () => {
    childAnimations.forEach(animation => {
      animation.pause();
    });

    if (initialized) {
      if (supportsWebAnimations) {
        getWebAnimations().forEach(animation => {
          animation.pause();
        });
      } else {
        elements.forEach(element => {
          setStyleProperty(element, 'animation-play-state', 'paused');
        });
      }
    }

    return ani;
  };

  /**
   * Play the animation asynchronously.
   * This returns a promise that resolves
   * when the animation has ended.
   */
  const playAsync = () => {
    return new Promise(resolve => {
      onFinish(resolve);
      play();

      return ani;
    });
  };

  /**
   * Play the animation synchronously. This
   * is the equivalent of running the animation
   * with a duration of 0ms.
   */
  const playSync = () => {
    shouldForceSyncPlayback = true;

    onFinish(() => shouldForceSyncPlayback = false);
    play();

    return ani;
  };

  /**
   * Play the animation
   */
  const play = () => {
    if (!initialized) {
      initializeAnimation();
    } else {
      updateCSSAnimation(true);
    }

    if (shouldCalculateNumAnimations) {
      numAnimationsRunning = childAnimations.length + 1;
      shouldCalculateNumAnimations = false;
    }

    childAnimations.forEach(animation => {
      animation.play();
    });

    if (supportsWebAnimations) {
      getWebAnimations().forEach(animation => {
        animation.play();
      });

      if (_keyframes.length === 0 || elements.length === 0) {
        animationFinish();
      }
    } else {
      elements.forEach(element => {
        if (_keyframes.length > 0) {
          setStyleProperty(element, 'animation-play-state', 'running');
        }
      });

      /**
       * CSS Animations will not fire an `animationend` event
       * for elements with `display: none`. The Web Animations API
       * accounts for this, but using raw CSS Animations requires
       * this workaround.
       */
      const visibleElements = elements.filter(element => element.offsetParent !== null);
      if (visibleElements.length === 0 || _keyframes.length === 0 || elements.length === 0) {
        animationFinish();
      }
    }

    return ani;
  };

  /**
   * Stop the animation and reset
   * all elements to their initial state
   */
  const stop = () => {
    childAnimations.forEach(animation => {
      animation.stop();
    });

    if (initialized) {
      cleanUp();
      initialized = false;
    }

    return ani;
  };

  const from = (property: string, value: any) => {
    const firstFrame = _keyframes[0];

    if (firstFrame != null && (firstFrame.offset === undefined || firstFrame.offset === 0)) {
      firstFrame[property] = value;
    } else {
      const object: any = {
        offset: 0
      };
      object[property] = value;

      _keyframes = [
        object,
        ..._keyframes
      ];
    }

    return ani;
  };

  const to = (property: string, value: any) => {
    const lastFrame = _keyframes[_keyframes.length - 1];

    if (lastFrame != null && (lastFrame.offset === undefined || lastFrame.offset === 1)) {
        lastFrame[property] = value;
    } else {

      const object: any = {
        offset: 1
      };
      object[property] = value;

      _keyframes = [
        ..._keyframes,
        object
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
  } as Animation;
};
