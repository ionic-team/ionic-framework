import type { Hue, IonPadding } from '../../themes/themes.interfaces';

export const ION_TITLE_SIZES = ['small', 'medium', 'large'] as const;
export type IonTitleSize = (typeof ION_TITLE_SIZES)[number];

type IonTitleSizeDefinition = {
  font?: {
    size?: string;
    weight?: string;
  };

  line?: {
    height?: string;
  };

  padding?: IonPadding;

  // TODO(FW-6864): remove for small and medium when ion-toolbar titlePlacement works in every theme (ios center, md start)
  position?: string;

  text?: {
    align?: string;
  };
};

export type IonTitleRecipe = {
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

  // TODO(FW-6864): remove when ion-toolbar titlePlacement works in every theme (ios center, md start)
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
    };
  };
};

export type IonTitleConfig = {
  hue?: Hue;
  size?: IonTitleSize;
};
