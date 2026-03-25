import type { IonPadding, IonMargin } from '../../themes/themes.interfaces.js';

export type IonChipRecipe = {
  letterSpacing?: string | number;
  lineHeight?: string | number;
  margin?: IonMargin;
  padding?: IonPadding;
  gap?: string | number;

  font?: {
    weight?: string | number;
  };

  // Hues with fills
  hue?: {
    [K in IonChipHue]?: IonChipFillDefinition;
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
  minHeight?: string | number;

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
  // Styles for the media component only if it is the first element in the slot
  leading?: {
    margin?: IonMargin;
  };

  // Styles for the media component only if it is the last element in the slot
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
  hue?: IonChipHue;
  size?: IonChipSize;
  shape?: IonChipShape;
};

export type IonChipFill = 'outline' | 'solid';
export type IonChipHue = 'bold' | 'subtle';
export type IonChipSize = 'small' | 'large';
export type IonChipShape = 'soft' | 'round' | 'rectangular';
