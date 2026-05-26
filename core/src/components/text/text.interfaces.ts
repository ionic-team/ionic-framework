export type IonTextRecipe = {
  hue?: {
    [K in IonTextHue]?: {
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
  hue?: IonTextHue;
};

export type IonTextHue = 'bold' | 'subtle';
