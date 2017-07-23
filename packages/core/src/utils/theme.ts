import { CssClassMap } from '@stencil/core';


export function createThemedClasses(mode: string, color: string, classList: string): CssClassMap {
  let allClassObj: CssClassMap = {};

  return classList.split(' ')
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
    }, allClassObj);
}
