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
    bold?: IonChipFillDefinition;
    subtle?: IonChipFillDefinition;
  };

  // Sizes
  size?: {
    small?: IonChipSizeDefinition;
    large?: IonChipSizeDefinition;
  };

  // Shapes
  shape?: {
    soft?: IonChipShapeDefinition;
    round?: IonChipShapeDefinition;
    rectangular?: IonChipShapeDefinition;
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
  solid: IonChipStateDefinition & {
    semantic?: IonChipStateDefinition;
  };

  outline: IonChipStateDefinition & {
    semantic?: IonChipStateDefinition;
  };
};

type IonChipStateDefinition = {
  default: IonChipColorDefinition;
  hover?: IonChipColorDefinition;
  focus?: IonChipColorDefinition;
  activated?: IonChipColorDefinition;
  disabled?: IonChipColorDefinition;
};

// Basic colors for a state
type IonChipColorDefinition = {
  bg?: string;
  color?: string;
  border?: {
    color?: string;
    style?: string;
    width?: string | number;
  };
};

type IonChipSizeDefinition = {
  minHeight: string | number;

  font: {
    size: string | number;
  };
};

type IonChipShapeDefinition = {
  border: {
    radius: string | number;
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

  font: {
    size?: string | number;
  };
};

type IonChipAvatarDefinition = IonChipMediaDefinition & {
  height?: string | number;
  width?: string | number;
};

export type IonChipConfig = {
  fill?: 'outline' | 'solid';
  hue?: 'bold' | 'subtle';
  size?: 'small' | 'large';
  shape?: 'soft' | 'round' | 'rectangular';
};
