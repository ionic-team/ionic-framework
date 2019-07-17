// TODO: Add validation
// TODO: More tests

export interface Animation {
  parentAnimation: Animation | undefined;
  elements: HTMLElement[];
  childAnimations: Animation[];
  beforeAddClasses: string[];
  beforeRemoveClasses: string[];
  beforeStylesValue: { [property: string]: any };
  afterAddClasses: string[];
  afterRemoveClasses: string[];
  afterStylesValue: { [property: string]: any };

  animationFinish(): void;

  play(): Animation;
  playStep(step: number): Animation;
  pause(): Animation;
  stop(): Animation;
  destroy(): Animation;
  progressStart(): Animation;

  from(property: string, value: any): Animation;
  to(property: string, value: any): Animation;
  fromTo(property: string, fromValue: any, toValue: any): Animation;
  keyframes(keyframes: any[]): Animation;

  addAnimation(animationToADd: Animation | Animation[] | undefined | null): Animation;
  addTarget(target: string): Animation;
  addElement(el: Element | Element[] | Node | Node[] | NodeList | undefined | null): Animation;
  iterations(iterations: number): Animation;
  fill(fill: 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined): Animation;
  direction(direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined): Animation;
  duration(duration: number): Animation;
  easing(easing: string): Animation;
  delay(delay: number): Animation;
  name(name: string): Animation;
  parent(animation: Animation): Animation;

  getKeyframes(): any[];
  getDirection(): 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined;
  getFill(): 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined;
  getDelay(): number | undefined;
  getIterations(): number | undefined;
  getEasing(): string | undefined;
  getDuration(): number | undefined;

  afterClearStyles(propertyNames: string[]): Animation;
  afterStyles(styles: { [property: string]: any }): Animation;
  afterRemoveClass(className: string | string[] | undefined): Animation;
  afterAddClass(className: string | string[] | undefined): Animation;
  beforeClearStyles(propertyNames: string[]): Animation;
  beforeStyles(styles: { [property: string]: any }): Animation;
  beforeRemoveClass(className: string | string[] | undefined): Animation;
  beforeAddClass(className: string | string[] | undefined): Animation;

  onFinish(callback: any): Animation;
}

const animationEnd = (el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  const opts: any = { passive: true };

  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };

  const onTransitionEnd = (ev: Event) => {
    if (el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  };

  if (el) {
    el.addEventListener('webkitAnimationEnd', onTransitionEnd, opts);
    el.addEventListener('animationend', onTransitionEnd, opts);

    unRegTrans = () => {
      el.removeEventListener('webkitAnimationEnd', onTransitionEnd, opts);
      el.removeEventListener('animationend', onTransitionEnd, opts);
    };
  }

  return unregister;
};

const supportsWebAnimations = (): boolean => {
 return !!(window as any).Animation;
};

const generateKeyframeString = (name: string | undefined, keyframes: any[] = []): string => {
  if (name === undefined) { console.warn('A name is required to generate keyframes'); }

  const keyframeString = [`@keyframes ${name} {`];

  keyframes.forEach(keyframe => {
    const offset = keyframe.offset;
    delete keyframe.offset;

    const frameString = [];
    for (const property in keyframe) {
      if (keyframe.hasOwnProperty(property)) {
        frameString.push(`${property}: ${keyframe[property]};`);
      }
    }

    keyframeString.push(`${offset * 100}% { ${frameString.join(' ')} }`);
  });

  return keyframeString.join(' ');
};

const createKeyframeStylesheet = (keyframeString: string): HTMLElement => {
  const stylesheet = document.createElement('style');
  stylesheet.appendChild(document.createTextNode(keyframeString));
  document.querySelector('head')!.appendChild(stylesheet);

  return stylesheet;
};

const addClassToArray = (classes: string[] = [], className: string | string[] | undefined): string[] => {
  if (className !== undefined) {
    const classNameToAppend = (Array.isArray(className)) ? className : [className];

    return [...classes, ...classNameToAppend];
  }

  return classes;
};

export const createAnimation = (animationNameValue: string | undefined): Animation => {
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

  let stylesheet: HTMLElement | undefined;

  let parentAnimation: Animation | undefined;

  let beforeAddClasses: string[] = [];
  let beforeRemoveClasses: string[] = [];
  let beforeStylesValue: { [property: string]: any } = {};

  let afterAddClasses: string[] = [];
  let afterRemoveClasses: string[] = [];
  let afterStylesValue: { [property: string]: any } = {};

  let webAnimations: any[] = [];
  let onFinishCallback: any | undefined;

  let numAnimationsRunning = 0;

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

    initialized = false;

    return generatePublicAPI();
  };

  const cleanUp = () => {
    cleanUpElements();
    cleanUpStyleSheets();
  };

  const onFinish = (callback: any): Animation => {
    onFinishCallback = callback;

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
    if (stylesheet) {
      stylesheet.parentNode!.removeChild(stylesheet);
      stylesheet = undefined;
    }
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
    if (_direction !== undefined) { return _direction; }
    if (parentAnimation) { return parentAnimation.getDirection(); }

    return undefined;

  };

  const getEasing = (): string | undefined => {
    if (_easing !== undefined) { return _easing; }
    if (parentAnimation) { return parentAnimation.getEasing(); }

    return undefined;
  };

  const getDuration = (): number | undefined => {
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

  const beforeAnimation = () => {
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

  const afterAnimation = () => {
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

    if (onFinishCallback !== undefined) {
      onFinishCallback(generatePublicAPI());
    }
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
    if (!stylesheet) {
        stylesheet = createKeyframeStylesheet(generateKeyframeString(_name, _keyframes));
      }

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

        element.style.setProperty('animation-directiteration-countion', iterationsCount);
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

  const playStep = (step: number): Animation => {
    childAnimations.forEach(animation => {
      animation.playStep(step);
    });

    progressStart();
    pause();

    if (getDuration() !== undefined) {
      if (supportsWebAnimations()) {
        webAnimations.forEach(animation => {
          animation.currentTime = animation.effect.getComputedTiming().delay + (getDuration()! * step);
        });
      } else {
        const animationDuration = `-${getDuration()! * step}ms`;

        elements.forEach(element => {
          (element as HTMLElement).style.animationDelay = animationDuration;
        });
      }
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

  const play = (): Animation => {
    childAnimations.forEach(animation => {
      animation.play();
    });

    progressStart(true);

    if (supportsWebAnimations()) {
      webAnimations.forEach(animation => {
        animation.play();
      });
    } else {
      elements.forEach(element => {
        (element as HTMLElement).style.animationPlayState = 'running';
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

  const progressStart = (reset = false): Animation => {
    if (initialized && reset) {
      initialized = false;
      cleanUpElements();
    }

    if (!initialized) {
      initializeAnimation();
    }

    return generatePublicAPI();
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
      pause,
      stop,
      playStep,
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
      afterClearStyles,
      afterStyles,
      afterRemoveClass,
      afterAddClass,
      beforeClearStyles,
      beforeStyles,
      beforeRemoveClass,
      beforeAddClass,
      onFinish,
      progressStart
    };
  };

  if (animationNameValue !== undefined) {
    name(animationNameValue);
  }

  return generatePublicAPI();
};
