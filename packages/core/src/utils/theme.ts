import { CssClassMap } from '@stencil/core';

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export function createThemedClasses(mode: string, color: string, classes: string): CssClassMap {
  const classObj: CssClassMap = {};

  return classes.split(' ')
    .reduce((classObj: CssClassMap, classString: string): CssClassMap => {
      classObj[classString] = true;

      if (mode) {
        classObj[`${classString}-${mode}`] = true;

        if (color) {
          classObj[`${classString}-${color}`] = true;
          classObj[`${classString}-${mode}-${color}`] = true;
        }
      }

      return classObj;
    }, classObj);
}

/**
 * Get the classes from a class list and return them as an object
 */
export function getElementClassMap(classList: DOMTokenList | string[]): CssClassMap {
  const classObj: CssClassMap = {};

  for (let i = 0; i < classList.length; i++) {
    classObj[classList[i]] = true;
  }

  return classObj;
}

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
export function getButtonClassMap(buttonType: string, mode: string): CssClassMap {
  if (!buttonType) {
    return {};
  }
  return {
    [buttonType]: true,
    [`${buttonType}-${mode}`]: true
  };
}


export function getClassMap(classes: string): CssClassMap {
  const map: CssClassMap = {};
  if (classes) {
    classes
      .split(' ')
      .filter(c => c.trim() !== '')
      .forEach(c => map[c] = true);
  }
  return map;
}

