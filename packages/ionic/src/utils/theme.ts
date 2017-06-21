import { CssClassObject } from '../util/interfaces';

export function createThemedClasses(mode: string, color: string, classList: string): CssClassObject {
  let allClassObj: CssClassObject = {};

  return classList.split(' ')
    .reduce((classObj: CssClassObject, classString: string): CssClassObject => {
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
