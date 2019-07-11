// TODO: Add validation
// TODO: More tests

const addElement = (animationElements: any[], el: Node | Node[] | NodeList | undefined | null) => {
  if (el != null) {
    const nodeList = el as NodeList;
    if (nodeList.length >= 0) {
      for (let i = 0; i < nodeList.length; i++) {
        animationElements.push((el as any)[i]);
      }
    } else {
      animationElements.push(el);
    }
  }
};

const addAnimation = (parentAnimation: Animation, childAnimations: Animation[], animationToAdd: Animation | Animation[] | undefined | null) => {
  if (animationToAdd != null) {
    const animationsToAdd = animationToAdd as Animation[];
    if (animationsToAdd.length >= 0) {
      for (const animation of animationsToAdd) {
        animation.parentAnimation = parentAnimation;
        childAnimations.push(animation);
      }
    } else {
      (animationToAdd as Animation).parentAnimation = parentAnimation;
      childAnimations.push(animationToAdd as Animation);
    }
  }
};

const addTarget = (animationElements: any[], target: string) => {
  const els = document.querySelectorAll(target);
  addElement(animationElements, els);
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

export class Animation {
  private elements: Element[] = [];
  private childAnimations: Animation[] = [];

  private _delay: number | undefined;
  private _duration: number | undefined;
  private _easing: string | undefined;
  private _iterations: number | undefined;

  private _keyframes: any[] = [];
  private _keyframeString = '';

  private initialized = false;

  private stylesheet?: HTMLElement;

  parentAnimation: Animation | undefined;

  private beforeAddClasses: string[] = [];
  private beforeRemoveClasses: string[] = [];
  private beforeStylesValue: { [property: string]: any } = {};

  private afterAddClasses: string[] = [];
  private afterRemoveClasses: string[] = [];
  private afterStylesValue: { [property: string]: any } = {};

  constructor(public _name: string | undefined) {}

  /**
   * Destroy this animation and all child animations.
   */
  destroy(): Animation {
    this.childAnimations.forEach(childAnimation => {
      childAnimation.destroy();
    });

    this.elements = [];
    this.childAnimations = [];

    return this;
  }

  /**
   * Add CSS class to this animation's elements
   * before the animation begins.
   */
  beforeAddClass(className: string | string[] | undefined): Animation {
    this.beforeAddClasses = addClassToArray(this.beforeAddClasses, className);

    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * before the animation begins.
   */
  beforeRemoveClass(className: string | string[] | undefined): Animation {
    this.beforeRemoveClasses = addClassToArray(this.beforeRemoveClasses, className);

    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * before the animation begins.
   */
  beforeStyles(styles: { [property: string]: any } = {}): Animation {
    this.beforeStylesValue = styles;

    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * before the animation begins.
   */
  beforeClearStyles(propertyNames: string[] = []): Animation {
    for (const property of propertyNames) {
      this.beforeStylesValue[property] = '';
    }

    return this;
  }

  /**
   * Add CSS class to this animation's elements
   * after the animation ends.
   */
  afterAddClass(className: string | string[] | undefined): Animation {
    this.afterAddClasses = addClassToArray(this.afterAddClasses, className);

    return this;
  }

  /**
   * Remove CSS class from this animation's elements
   * after the animation ends.
   */
  afterRemoveClass(className: string | string[] | undefined): Animation {
    this.afterRemoveClasses = addClassToArray(this.afterRemoveClasses, className);

    return this;
  }

  /**
   * Set CSS inline styles to this animation's elements
   * after the animation ends.
   */
  afterStyles(styles: { [property: string]: any } = {}): Animation {
    this.afterStylesValue = styles;

    return this;
  }

  /**
   * Clear CSS inline styles from this animation's elements
   * after the animation ends.
   */
  afterClearStyles(propertyNames: string[] = []): Animation {
    for (const property of propertyNames) {
      this.afterStylesValue[property] = '';
    }

    return this;
  }

  getEasing(): string | undefined {
    if (this._easing !== undefined) { return this._easing; }
    if (this.parentAnimation) { return this.parentAnimation.getEasing(); }

    return undefined;
  }

  getDuration(): number | undefined {
    if (this._duration !== undefined) { return this._duration; }
    if (this.parentAnimation) { return this.parentAnimation.getDuration(); }

    return undefined;
  }

  getIterations(): number | undefined {
    if (this._iterations !== undefined) { return this._iterations; }
    if (this.parentAnimation) { return this.parentAnimation.getIterations(); }

    return undefined;
  }

  getDelay(): number | undefined {
    if (this._delay !== undefined) { return this._delay; }
    if (this.parentAnimation) { return this.parentAnimation.getDelay(); }

    return undefined;
  }

  getKeyframes(): any[] {
    return this._keyframes;
  }

  name(name: string): Animation {
    this._name = name;

    return this;
  }

  delay(delay: number): Animation {
    this._delay = delay;

    return this;
  }

  easing(easing: string): Animation {
    this._easing = easing;

    return this;
  }

  duration(duration: number): Animation {
    this._duration = duration;

    return this;
  }

  iterations(iterations: number): Animation {
    this._iterations = iterations;

    return this;
  }

  addElement(el: Node | Node[] | NodeList | undefined | null): Animation {
    addElement(this.elements, el);

    return this;
  }

  addTarget(target: string): Animation {
    addTarget(this.elements, target);

    return this;
  }

  addAnimation(childAnimation: Animation | undefined | null): Animation {
    addAnimation(this, this.childAnimations, childAnimation);

    return this;
  }

  keyframes(keyframes: any[]): Animation {
    this._keyframes = keyframes;
    this._keyframeString = generateKeyframeString(this._name, keyframes);

    return this;
  }

  private initializeAnimation(): void {
    if (!this.stylesheet) {
      this.stylesheet = createKeyframeStylesheet(this._keyframeString);
    }

    const animationName = this._name;
    const animationDuration = this.getDuration();
    const animationEasing = this.getEasing();
    const animationIterationCount = this.getIterations();
    const animationDelay = this.getDelay();

    this.elements.forEach(element => {
      if (animationName !== undefined) {
        (element as HTMLElement).style.animationName = animationName;
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

    this.initialized = true;
  }

  playStep(step: number): Animation {
    if (!this.initialized) {
      this.initializeAnimation();
    }

    this.childAnimations.forEach(animation => {
      animation.playStep(step);
    });

    this.pause();

    if (this.getDuration() !== undefined) {
      const animationDuration = `-${this.getDuration()! * step}ms`;

      this.elements.forEach(element => {
        (element as HTMLElement).style.animationDelay = animationDuration;
      });
    }

    return this;
  }

  pause(): Animation {
    if (this.initialized) {
      this.childAnimations.forEach(animation => {
        animation.pause();
      });

      this.elements.forEach(element => {
        (element as HTMLElement).style.animationPlayState = 'paused';
      });
    }

    return this;
  }

  play(): Animation {
    if (!this.initialized) {
      this.initializeAnimation();
    }

    this.childAnimations.forEach(animation => {
      animation.play();
    });

    this.elements.forEach(element => {
      (element as HTMLElement).style.animationPlayState = 'running';
    });

    return this;
  }
}
