import type { Hue } from '../../themes/themes.interfaces';

export type IonTextRecipe = {
  hue?: {
    [K in Hue]?: {
      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        default?: {
          color?: string;
        };
      };
    };
  };
};

export type IonTextConfig = {
  hue?: Hue;
};
