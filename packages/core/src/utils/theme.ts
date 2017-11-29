import { CssClassMap } from '@stencil/core';

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export function createThemedClasses(mode: string, color: string, classes: string): CssClassMap {
  let classObj: CssClassMap = {};

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
export function getElementClassObject(classList: DOMTokenList | string[]): CssClassMap {
  let classObj: CssClassMap = {};

  for (var i = 0; i < classList.length; i++) {
    classObj[classList[i]] = true;
  }

  return classObj;
}
