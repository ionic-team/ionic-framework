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

  letterSpacing?: string;

  // TODO(FW-6864): remove when ion-toolbar titlePlacement works in every theme (ios center, md start)
  position?: {
    top?: string;
    end?: string;
    bottom?: string;
    start?: string;
  };

  size?: {
    // TODO(FW-6864): remove position when ion-toolbar titlePlacement works in every theme (ios center, md start)
    small?: IonTitleSizeDefinition & { position?: string };
    medium?: IonTitleSizeDefinition & { position?: string };

    large?: IonTitleSizeDefinition & {
      align?: {
        items?: string;
      };
    };
  };
};

export type IonTitleConfig = {
  hue?: Hue;
  size?: IonTitleSize;
};
