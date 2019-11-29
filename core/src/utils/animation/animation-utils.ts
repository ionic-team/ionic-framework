let animationPrefix: string | null = null;

export const getAnimationPrefix = (): string => {
  if (animationPrefix === null) {
    const eleStyle: { [key: string]: any } = document.createElement('div').style;
    animationPrefix = '';
    if (eleStyle.animationName === undefined) {
      const domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
      for (const prefix of domPrefixes) {
        if (eleStyle[prefix + 'AnimationName'] !== undefined) {
          animationPrefix = '-' + prefix.toLowerCase() + '-';
          break;
        }
      }
    }
  }
  return animationPrefix;
};

export const setStyleProperty = (element: HTMLElement, propertyName: string, value: string | null) => {
  element.style.setProperty(getAnimationPrefix() + propertyName, value);
};

export const removeStyleProperty = (element: HTMLElement, propertyName: string) => {
  element.style.removeProperty(getAnimationPrefix() + propertyName);
};

export const animationEnd = (el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) => {
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

export const generateKeyframeRules = (keyframes: any[] = []) => {
  return keyframes.map(keyframe => {
    const offset = keyframe.offset;

    const frameString = [];
    for (const property in keyframe) {
      if (keyframe.hasOwnProperty(property) && property !== 'offset') {
        frameString.push(`${property}: ${keyframe[property]};`);
      }
    }

    return `${offset * 100}% { ${frameString.join(' ')} }`;
  }).join(' ');
};

const keyframeIds: string[] = [];

export const generateKeyframeName = (keyframeRules: string) => {
  let index = keyframeIds.indexOf(keyframeRules);
  if (index < 0) {
    index = (keyframeIds.push(keyframeRules) - 1);
  }
  return `ion-animation-${index}`;
};

export const getStyleContainer = (element: HTMLElement) => {
  const rootNode = (element.getRootNode() as any);
  return (rootNode.head || rootNode);
};

export const createKeyframeStylesheet = (keyframeName: string, keyframeRules: string, element: HTMLElement): HTMLElement => {
  const styleContainer = getStyleContainer(element);
  const keyframePrefix = getAnimationPrefix();

  const existingStylesheet = styleContainer.querySelector('#' + keyframeName);
  if (existingStylesheet) {
    return existingStylesheet;
  }

  const stylesheet = (element.ownerDocument || document).createElement('style');
  stylesheet.id = keyframeName;
  stylesheet.textContent = `@${keyframePrefix}keyframes ${keyframeName} { ${keyframeRules} } @${keyframePrefix}keyframes ${keyframeName}-alt { ${keyframeRules} }`;

  styleContainer.appendChild(stylesheet);

  return stylesheet;
};

export const addClassToArray = (classes: string[] = [], className: string | string[] | undefined): string[] => {
  if (className !== undefined) {
    const classNameToAppend = (Array.isArray(className)) ? className : [className];

    return [...classes, ...classNameToAppend];
  }

  return classes;
};
