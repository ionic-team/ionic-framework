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

  parent(animation: Animation): Animation;
  play(): Animation;
  pause(): Animation;
  stop(): Animation;
  playStep(step: number): Animation;
  destroy(): Animation;
  keyframes(keyframes: any[]): Animation;
  addAnimation(animationToADd: Animation | Animation[] | undefined | null): Animation;
  addTarget(target: string): Animation;
  addElement(el: Node | Node[] | NodeList | undefined | null): Animation;
  iterations(iterations: number): Animation;
  duration(duration: number): Animation;
  easing(easing: string): Animation;
  delay(delay: number): Animation;
  name(name: string): Animation;
  getKeyframes(): any[];
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
}

const animationEnd = (el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  const opts: any = { passive: true };

  function unregister() {
    if (unRegTrans) {
      unRegTrans();
    }
  }

  function onTransitionEnd(ev: Event) {
    if (el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  }

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

  let _keyframes: any[] = [];
  let _keyframeString = '';

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

  const addElement = (el: Node | Node[] | NodeList | undefined | null): Animation => {
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

    if (!supportsWebAnimations()) {
      _keyframeString = generateKeyframeString(_name, keyframeValues);
    }

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

    cleanUpElements();
  };

  const initializeAnimation = () => {
    beforeAnimation();

    if (supportsWebAnimations()) {
      console.log('Your browser supports Web Animations');
      elements.forEach((element, i) => {
        const animation = element.animate(getKeyframes(), {
          delay: getDelay(),
          duration: getDuration(),
          easing: getEasing(),
          iterations: getIterations()
        });

        if (i === 0) {
          animation.onfinish = () => {
            afterAnimation();
          };
        }

        console.log(animation);
        animation.pause();

        webAnimations.push(animation);
      });

    } else {
      if (!stylesheet) {
        stylesheet = createKeyframeStylesheet(_keyframeString);
      }

      const animationDuration = getDuration();
      const animationEasing = getEasing();
      const animationIterationCount = getIterations();
      const animationDelay = getDelay();

      elements.forEach(element => {
        if (_name !== undefined) {
          (element as HTMLElement).style.animationName = _name;
        }

        if (animationDuration !== undefined) {
          (element as HTMLElement).style.animationDuration = `${animationDuration}ms`;
        }

        if (animationEasing !== undefined) {
          (element as HTMLElement).style.animationTimingFunction = animationEasing;
        }

        if (animationIterationCount !== undefined) {
          (element as HTMLElement).style.animationIterationCount = (animationIterationCount === Infinity) ? 'infinite' : animationIterationCount.toString();
        }

        if (animationDelay !== undefined) {
          (element as HTMLElement).style.animationDelay = `${animationDelay}ms`;
        }
      });

      animationEnd(elements[0], () => {
        afterAnimation();
      });
    }

    initialized = true;
  };

  const playStep = (step: number): Animation => {
    childAnimations.forEach(animation => {
      animation.playStep(step);
    });

    if (!initialized) {
      initializeAnimation();
    }

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

    if (!initialized) {
      initializeAnimation();
    }

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
      iterations,
      duration,
      easing,
      delay,
      name,
      getKeyframes,
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
    };
  };

  if (animationNameValue !== undefined) {
    name(animationNameValue);
  }

  return generatePublicAPI();
};
