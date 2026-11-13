import type { Hue } from '../../themes/themes.interfaces';

export type IonNoteRecipe = {
  font?: {
    family?: string;
    size?: string;
  };

  hue?: {
    [K in Hue]?: {
      default?: {
        color?: string;
      };

      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        default?: {
          color?: string;
        };
      };
    };
  };

  letterSpacing?: string;

  line?: {
    height?: string;
  };
};

export type IonNoteConfig = {
  hue?: Hue;
};
