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

export const supportsWebAnimations = (): boolean => {
  return !!(window as any).Animation;
};

export const generateKeyframeString = (name: string | undefined, keyframes: any[] = []): string => {
  if (name === undefined) { console.warn('A name is required to generate keyframes'); }

  const keyframeString = [`@keyframes ${name} {`];

  keyframes.forEach(keyframe => {
    const offset = keyframe.offset;

    const frameString = [];
    for (const property in keyframe) {
      if (keyframe.hasOwnProperty(property) && property !== 'offset') {
        frameString.push(`${property}: ${keyframe[property]};`);
      }
    }

    keyframeString.push(`${offset * 100}% { ${frameString.join(' ')} }`);
  });

  keyframeString.push('}');

  return keyframeString.join(' ');
};

export const createKeyframeStylesheet = (name: string | undefined, keyframeString: string, element: HTMLElement): HTMLElement | undefined => {
  const stylesheetId = `ion-${name}`;
  const stylesheet = document.createElement('style');
  stylesheet.id = stylesheetId;
  stylesheet.appendChild(document.createTextNode(keyframeString));

  const rootNode = (element.getRootNode() as any);
  const styleContainer = (rootNode.head || rootNode);

  const existingStylesheet = rootNode.querySelector(`#${stylesheetId}`);
  if (existingStylesheet) { return; }

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
