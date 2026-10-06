import type { Hue, IonPadding } from '../../themes/themes.interfaces';

export const ION_TITLE_SIZES = ['small', 'medium', 'large'] as const;
export type IonTitleSize = (typeof ION_TITLE_SIZES)[number];

type IonTitleSizeDefinition = {
  font?: {
    size?: string;
    weight?: string;
  };

  height?: string;

  line?: {
    height?: string;
  };

  padding?: IonPadding;
  position?: string;

  text?: {
    align?: string;
  };

  width?: string;
};

export type IonTitleRecipe = {
  boxSizing?: string;
  color?: string;

  font?: {
    family?: string;
  };

  hue?: {
    [K in Hue]?: {
      semantic?: {
        default?: {
          color?: string;
        };
      };
    };
  };

  letter?: {
    spacing?: string;
  };

  pointerEvents?: string;

  position?: {
    top?: string;
    end?: string;
    bottom?: string;
    start?: string;
  };

  size?: {
    small?: IonTitleSizeDefinition;
    medium?: IonTitleSizeDefinition;

    large?: IonTitleSizeDefinition & {
      alignItems?: string;

      inner?: {
        width?: string;
      };

      minWidth?: string;

      transform?: {
        origin?: {
          x?: string;
        };
      };
    };
  };
};

export type IonTitleConfig = {
  hue?: Hue;
  size?: IonTitleSize;
};
