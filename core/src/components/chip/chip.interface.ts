import type { IonPadding, IonMargin, Hue } from '../../themes/themes.interfaces';

export type IonChipRecipe = {
  letterSpacing?: string | number;
  line?: {
    height?: string | number;
  };
  margin?: IonMargin;
  padding?: IonPadding;
  gap?: string | number;

  font?: {
    weight?: string | number;
  };

  // Hues with fills
  hue?: {
    [K in Hue]?: IonChipFillDefinition;
  };

  // Sizes
  size?: {
    [K in IonChipSize]?: IonChipSizeDefinition;
  };

  // Shapes
  shape?: {
    [K in IonChipShape]?: IonChipShapeDefinition;
  };

  // Shared States
  state?: {
    disabled?: {
      opacity?: string | number;
    };

    focus?: {
      ring?: {
        color?: string;
        style?: string;
        width?: string | number;
      };
    };
  };

  icon?: IonChipIconDefinition;
  avatar?: IonChipAvatarDefinition;
};

type IonChipFillDefinition = {
  [K in IonChipFill]?: IonChipStateDefinition & {
    semantic?: IonChipStateDefinition;
  };
};

type IonChipStateDefinition = {
  default?: IonChipColorDefinition;
  hover?: IonChipColorDefinition;
  focus?: IonChipColorDefinition;
  activated?: IonChipColorDefinition;
  disabled?: IonChipColorDefinition;
};

// Basic colors for a state
type IonChipColorDefinition = {
  background?: string;
  color?: string;
  border?: {
    color?: string;
    style?: string;
    width?: string | number;
  };
};

type IonChipSizeDefinition = {
  min?: {
    height?: string | number;
  };

  font?: {
    size?: string | number;
  };
};

type IonChipShapeDefinition = {
  border?: {
    radius?: string | number;
  };
};

type IonChipMediaDefinition = {
  /** Targets `:first-child` */
  leading?: {
    margin?: IonMargin;
  };

  /** Targets `:last-child` */
  trailing?: {
    margin?: IonMargin;
  };
};

type IonChipIconDefinition = IonChipMediaDefinition & {
  color?: string;

  font?: {
    size?: string | number;
  };
};

type IonChipAvatarDefinition = IonChipMediaDefinition & {
  height?: string | number;
  width?: string | number;
};

export type IonChipConfig = {
  fill?: IonChipFill;
  hue?: Hue;
  size?: IonChipSize;
  shape?: IonChipShape;
};

export const ION_CHIP_FILLS = ['solid', 'outline'] as const;
export type IonChipFill = (typeof ION_CHIP_FILLS)[number];
export const ION_CHIP_SIZES = ['small', 'large'] as const;
export type IonChipSize = (typeof ION_CHIP_SIZES)[number];
export const ION_CHIP_SHAPES = ['soft', 'round', 'rectangular'] as const;
export type IonChipShape = (typeof ION_CHIP_SHAPES)[number];
