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

/*const getExistingStylesheet = (keyframeString: string, element: HTMLElement): HTMLElement | undefined => {
  const rootNode = (element.getRootNode() as any);
  const styleContainer = (rootNode.head || rootNode);

  const allStylesheets = styleContainer.querySelectorAll('style[ion-keyframes]');

  /**
   * If animations have the same keyframes, no point in
   * creating a new stylesheet. Just reuse the same one
  /*
  for (const stylesheet of allStylesheets) {
    if (stylesheet != null && stylesheet.innerText != null) {
      const textToCompare = stylesheet.innerText.split(/{(.+)/)[1];
      const newText = keyframeString.split(/{(.+)/)[1];

      if (textToCompare === newText) {
        return stylesheet;
      }
    }
  }

  return;
};*/

export const createKeyframeStylesheet = (name: string, keyframeString: string, element: HTMLElement): HTMLElement => {
/*
  TODO: Disabled for now. This is causing an incomplete swipe to go back to never resolve.
  const existingStylesheet = getExistingStylesheet(keyframeString, element);
  if (existingStylesheet) {
    return existingStylesheet;
  }
*/
  const doc = (element.ownerDocument || document);
  const stylesheet = doc.createElement('style');
  const rootNode = (element.getRootNode() as any);
  const styleContainer = (rootNode.head || rootNode);

  stylesheet.id = name;
  stylesheet.setAttribute('ion-keyframes', '');
  stylesheet.appendChild(doc.createTextNode(keyframeString));

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
