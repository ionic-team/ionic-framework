import { Animation } from './animation-interface';
import { addClassToArray, animationEnd, createKeyframeStylesheet, generateKeyframeString, supportsWebAnimations } from './animation-utils';

let counter = 0;

export const createAnimation = (): Animation => {
  let elements: HTMLElement[] = [];
  let childAnimations: Animation[] = [];
  let _name: string | undefined;
  let _delay: number | undefined;
  let _duration: number | undefined;
  let _easing: string | undefined;
  let _iterations: number | undefined;
  let _fill: 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined;
  let _direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined;
  let _keyframes: any[] = [];

  let initialized = false;

  let stylesheets: HTMLElement[] = [];

  let parentAnimation: Animation | undefined;

  let beforeAddClasses: string[] = [];
  let beforeRemoveClasses: string[] = [];
  let beforeStylesValue: { [property: string]: any } = {};

  let afterAddClasses: string[] = [];
  let afterRemoveClasses: string[] = [];
  let afterStylesValue: { [property: string]: any } = {};

  let webAnimations: any[] = [];
  let onFinishCallbacks: any[] = [];

  let numAnimationsRunning = 0;

  let shouldForceLinearEasing = false;
  let shouldForceSyncPlayback = false;
  let shouldForceReverseDirection = false;
  let willComplete = true;

  const _beforeAddReadFunctions: any[] = [];
  const _beforeAddWriteFunctions: any[] = [];
  const _afterAddReadFunctions: any[] = [];
  const _afterAddWriteFunctions: any[] = [];

  /**
   * Destroy this animation and all child animations.
   */
  const destroy = (): Animation => {
    childAnimations.forEach(childAnimation => {
      childAnimation.destroy();
    });

    cleanUp();

    elements = [];
    childAnimations = [];
    onFinishCallbacks = [];

    initialized = false;

    return generatePublicAPI();
  };

  const cleanUp = () => {
    cleanUpElements();
    cleanUpStyleSheets();
  };

  const onFinish = (callback: any): Animation => {
    onFinishCallbacks.push(callback);

    return generatePublicAPI();
  };

  const cleanUpElements = () => {
    if (supportsWebAnimations()) {
      webAnimations.forEach(animation => {
        animation.cancel();
      });

      webAnimations = [];
    } else {
      elements.forEach(element => {
        element.style.removeProperty('animation-name');
        element.style.removeProperty('animation-duration');
        element.style.removeProperty('animation-timing-function');
        element.style.removeProperty('animation-iteration-count');
        element.style.removeProperty('animation-delay');
        element.style.removeProperty('animation-play-state');
        element.style.removeProperty('animation-fill-mode');
        element.style.removeProperty('animation-direction');
      });
    }
  };

  const cleanUpStyleSheets = () => {
    stylesheets.forEach(stylesheet => {
      stylesheet.parentNode!.removeChild(stylesheet);
    });

    stylesheets = [];
  };

  const beforeAddRead = (readFn: () => void): Animation => {
    _beforeAddReadFunctions.push(readFn);

    return generatePublicAPI();
  };

  const beforeAddWrite = (writeFn: () => void): Animation => {
    _beforeAddWriteFunctions.push(writeFn);

    return generatePublicAPI();
  };

  const afterAddRead = (readFn: () => void): Animation => {
    _afterAddReadFunctions.push(readFn);

    return generatePublicAPI();
  };

  const afterAddWrite = (writeFn: () => void): Animation => {
    _afterAddWriteFunctions.push(writeFn);

    return generatePublicAPI();
  };

  /**
   * Add CSS class to this animation's elements
   * before the animation begins.
   */
  const beforeAddClass = (className: string | string[] | undefined): Animation => {
    beforeAddClasses = addClassToArray(beforeAddClasses, className);

    return generatePublicAPI();
  };

  /**
   * Remove CSS class from this animation's elements
   * before the animation begins.
   */
  const beforeRemoveClass = (className: string | string[] | undefined): Animation => {
    beforeRemoveClasses = addClassToArray(beforeRemoveClasses, className);

    return generatePublicAPI();
  };

  /**
   * Set CSS inline styles to this animation's elements
   * before the animation begins.
   */
  const beforeStyles = (styles: { [property: string]: any } = {}): Animation => {
    beforeStylesValue = styles;

    return generatePublicAPI();
  };

  /**
   * Clear CSS inline styles from this animation's elements
   * before the animation begins.
   */
  const beforeClearStyles = (propertyNames: string[] = []): Animation => {
    for (const property of propertyNames) {
      beforeStylesValue[property] = '';
    }

    return generatePublicAPI();
  };

  /**
   * Add CSS class to this animation's elements
   * after the animation ends.
   */
  const afterAddClass = (className: string | string[] | undefined): Animation => {
    afterAddClasses = addClassToArray(afterAddClasses, className);

    return generatePublicAPI();
  };

  /**
   * Remove CSS class from this animation's elements
   * after the animation ends.
   */
  const afterRemoveClass = (className: string | string[] | undefined): Animation => {
    afterRemoveClasses = addClassToArray(afterRemoveClasses, className);

    return generatePublicAPI();
  };

  /**
   * Set CSS inline styles to this animation's elements
   * after the animation ends.
   */
  const afterStyles = (styles: { [property: string]: any } = {}): Animation => {
    afterStylesValue = styles;

    return generatePublicAPI();
  };

  /**
   * Clear CSS inline styles from this animation's elements
   * after the animation ends.
   */
  const afterClearStyles = (propertyNames: string[] = []): Animation => {
    for (const property of propertyNames) {
      afterStylesValue[property] = '';
    }

    return generatePublicAPI();
  };

  const getFill = (): 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined => {
    if (_fill !== undefined) { return _fill; }
    if (parentAnimation) { return parentAnimation.getFill(); }

    return undefined;
  };

  const getDirection = (): 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined => {
    if (shouldForceReverseDirection) { return 'reverse'; }
    if (_direction !== undefined) { return _direction; }
    if (parentAnimation) { return parentAnimation.getDirection(); }

    return undefined;

  };

  const getEasing = (): string | undefined => {
    if (shouldForceLinearEasing) { return 'linear'; }
    if (_easing !== undefined) { return _easing; }
    if (parentAnimation) { return parentAnimation.getEasing(); }

    return undefined;
  };

  const getDuration = (): number | undefined => {
    if (shouldForceSyncPlayback) { return 0; }
    if (_duration !== undefined) { return _duration; }
    if (parentAnimation) { return parentAnimation.getDuration(); }

    return undefined;
  };

  const getIterations = (): number | undefined => {
    if (_iterations !== undefined) { return _iterations; }
    if (parentAnimation) { return parentAnimation.getIterations(); }

    return undefined;
  };

  const getDelay = (): number | undefined => {
    if (_delay !== undefined) { return _delay; }
    if (parentAnimation) { return parentAnimation.getDelay(); }

    return undefined;
  };

  const getKeyframes = (): any[] => {
    return _keyframes;
  };

  const name = (animationName: string): Animation => {
    _name = animationName;

    return generatePublicAPI();
  };

  const direction = (animationDirection: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'): Animation => {
    _direction = animationDirection;

    return generatePublicAPI();
  };

  const fill = (animationFill: 'auto' | 'none' | 'forwards' | 'backwards' | 'both'): Animation => {
    _fill = animationFill;

    return generatePublicAPI();

  };

  const delay = (animationDelay: number): Animation => {
    _delay = animationDelay;

    return generatePublicAPI();
  };

  const easing = (animationEasing: string): Animation => {
    _easing = animationEasing;

    return generatePublicAPI();
  };

  const duration = (animationDuration: number): Animation => {
    _duration = animationDuration;

    return generatePublicAPI();
  };

  const iterations = (animationIterations: number): Animation => {
    _iterations = animationIterations;

    return generatePublicAPI();
  };

  const parent = (animation: Animation): Animation => {
    parentAnimation = animation;

    return generatePublicAPI();
  };

  const addElement = (el: Element | Element[] | Node | Node[] | NodeList | undefined | null): Animation => {
    if (el != null) {
      const nodeList = el as NodeList;
      if (nodeList.length >= 0) {
        for (let i = 0; i < nodeList.length; i++) {
          elements.push((el as any)[i]);
        }
      } else {
        elements.push(el as any);
      }
    }

    return generatePublicAPI();
  };

  const addTarget = (target: string): Animation => {
    const els = document.querySelectorAll(target);

    return addElement(els);
  };

  const addAnimation = (animationToAdd: Animation | Animation[] | undefined | null): Animation => {
    if (animationToAdd != null) {
      const parentAnim = generatePublicAPI();
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

    return generatePublicAPI();
  };

  const keyframes = (keyframeValues: any[]) => {
    _keyframes = keyframeValues;

    return generatePublicAPI();
  };

  const runBeforeRead = () => {
    _beforeAddReadFunctions.forEach(callback => {
      callback();
    });
  };

  const runBeforeWrite = () => {
    _beforeAddWriteFunctions.forEach(callback => {
      callback();
    });
  };

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
          el.style.setProperty(property, styles[property]);
        }
      }
    });
  };

  const beforeAnimation = () => {
    runBeforeRead();
    runBeforeWrite();
    runBeforeStyles();
  };

  const runAfterRead = () => {
    _afterAddReadFunctions.forEach(callback => {
      callback();
    });
  };

  const runAfterWrite = () => {
    _afterAddWriteFunctions.forEach(callback => {
      callback();
    });
  };

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
          el.style.setProperty(property, styles[property]);
        }
      }
    });
  };

  const afterAnimation = () => {
    runAfterRead();
    runAfterWrite();
    runAfterStyles();

    const didComplete = willComplete;

    onFinishCallbacks.forEach(callback => {
      callback(didComplete, generatePublicAPI());
    });
  };

  const animationFinish = () => {
    if (numAnimationsRunning === 0) { return; }

    numAnimationsRunning--;

    if (numAnimationsRunning === 0) {
      afterAnimation();
    }

    if (parentAnimation) {
      parentAnimation.animationFinish();
    }
  };

  const initializeCSSAnimation = () => {

    elements.forEach(element => {
      if (_keyframes.length > 0) {

        const stylesheet = createKeyframeStylesheet(_name, generateKeyframeString(_name, _keyframes), element);
        if (stylesheet) {
          stylesheets.push(stylesheet);
        }

        element.style.setProperty('animation-name', _name || null);
        element.style.setProperty('animation-duration', (getDuration() !== undefined) ? `${getDuration()}ms` : null);
        element.style.setProperty('animation-timing-function', getEasing() || null);
        element.style.setProperty('animation-delay', (getDelay() !== undefined) ? `${getDelay()}ms` : null);
        element.style.setProperty('animation-fill-mode', getFill() || null);
        element.style.setProperty('animation-direction', getDirection() || null);

        let iterationsCount = null;
        if (getIterations() !== undefined) {
          iterationsCount = (getIterations() === Infinity) ? 'infinite' : getIterations()!.toString();
        }

        element.style.setProperty('animation-iteration-countion', iterationsCount);
        element.style.setProperty('animation-play-state', 'paused');
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
      const animation = element.animate(getKeyframes(), {
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

  const initializeAnimation = () => {
    beforeAnimation();

    numAnimationsRunning = childAnimations.length + 1;

    if (getKeyframes().length === 0) {
      animationFinish();
    } else {
      if (supportsWebAnimations()) {
        initializeWebAnimation();
      } else {
        initializeCSSAnimation();
      }
    }

    initialized = true;
  };

  const progressStep = (step: number): Animation => {
    step = Math.min(Math.max(step, 0), 1);

    childAnimations.forEach(animation => {
      animation.progressStep(step);
    });

    if (getDuration() !== undefined) {
      if (supportsWebAnimations()) {
        webAnimations.forEach(animation => {
          animation.currentTime = animation.effect.getComputedTiming().delay + (getDuration()! * step);
          animation.pause();
        });
      } else {
        const animationDuration = `-${getDuration()! * step}ms`;

        elements.forEach(element => {
          if (_keyframes.length > 0) {
            (element as HTMLElement).style.animationDelay = animationDuration;
            (element as HTMLElement).style.animationPlayState = 'paused';
          }
        });
      }
    }

    return generatePublicAPI();
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

  const updateCSSAnimation = () => {
    elements.forEach(element => {
      element.style.setProperty('animation-name', _name || null);
      element.style.setProperty('animation-duration', (getDuration() !== undefined) ? `${getDuration()}ms` : null);
      element.style.setProperty('animation-timing-function', getEasing() || null);
      element.style.setProperty('animation-delay', (getDelay() !== undefined) ? `${getDelay()}ms` : null);
      element.style.setProperty('animation-fill-mode', getFill() || null);
      element.style.setProperty('animation-direction', getDirection() || null);

      let iterationsCount = null;
      if (getIterations() !== undefined) {
        iterationsCount = (getIterations() === Infinity) ? 'infinite' : getIterations()!.toString();
      }

      element.style.setProperty('animation-iteration-countion', iterationsCount);
    });
  };

  const updateAnimation = () => {
    if (supportsWebAnimations()) {
      updateWebAnimation();
    } else {
      updateCSSAnimation();
    }
  };

  const progressStart = (forceLinearEasing = false): Animation => {
    childAnimations.forEach(animation => {
      animation.progressStart(forceLinearEasing);
    });

    shouldForceLinearEasing = forceLinearEasing;

    initializeAnimation();

    return generatePublicAPI();
  };

  const progressEnd = (shouldComplete: boolean, step: number): Animation => {
    childAnimations.forEach(animation => {
      animation.progressEnd(shouldComplete, step);
    });

    shouldForceLinearEasing = false;
    willComplete = shouldComplete;

    if (!shouldComplete) {
      shouldForceReverseDirection = true;
      onFinish(() => { willComplete = true; shouldForceReverseDirection = false; });
      updateAnimation();
      progressStep(1 - step);
    }

    if (!parentAnimation) {
      play();
    }

    return generatePublicAPI();
  };

  const pause = (): Animation => {
    childAnimations.forEach(animation => {
      animation.pause();
    });

    if (initialized) {
      if (supportsWebAnimations()) {
        webAnimations.forEach(animation => {
          animation.pause();
        });
      } else {
        elements.forEach(element => {
          (element as HTMLElement).style.animationPlayState = 'paused';
        });
      }
    }

    return generatePublicAPI();
  };

  const playAsync = (): Promise<Animation> => {
    return new Promise(resolve => {
      onFinish(resolve);
      play();

      return generatePublicAPI();
    });
  };

  const playSync = (): Animation => {
    shouldForceSyncPlayback = true;

    onFinish(() => shouldForceSyncPlayback = false);
    play();

    return generatePublicAPI();
  };

  const play = (): Animation => {
    childAnimations.forEach(animation => {
      animation.play();
    });

    if (!initialized) {
      initializeAnimation();
    }

    if (supportsWebAnimations()) {
      webAnimations.forEach(animation => {
        animation.play();
      });
    } else {
      elements.forEach(element => {
        if (_keyframes.length > 0) {
        (element as HTMLElement).style.animationPlayState = 'running'; }
      });
    }

    return generatePublicAPI();
  };

  const stop = (): Animation => {
    childAnimations.forEach(animation => {
      animation.stop();
    });

    if (initialized) {
      cleanUp();
      initialized = false;
    }

    return generatePublicAPI();
  };

  const from = (property: string, value: any): Animation => {
    const keyframeValues = getKeyframes();
    const firstFrame = keyframeValues[0];

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

    return generatePublicAPI();
  };

  const to = (property: string, value: any): Animation => {

    const keyframeValues = getKeyframes();
    const lastFrame = keyframeValues[keyframeValues.length - 1];

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

    return generatePublicAPI();
  };

  const fromTo = (property: string, fromValue: any, toValue: any): Animation => {
    return from(property, fromValue).to(property, toValue);
  };

  const generatePublicAPI = (): Animation => {
    return {
      parentAnimation,
      elements,
      childAnimations,
      beforeAddClasses,
      beforeRemoveClasses,
      beforeStylesValue,
      afterAddClasses,
      afterRemoveClasses,
      afterStylesValue,

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
      addTarget,
      addElement,
      fill,
      direction,
      iterations,
      duration,
      easing,
      delay,
      name,
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

  name(`ion-animation-${counter}`);
  counter++;

  return generatePublicAPI();
};
