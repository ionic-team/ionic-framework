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
    bold?: ChipFills;
    subtle?: ChipFills;
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

type ChipFills = {
  solid: ChipStates & {
    semantic?: ChipStates;
  };

  outline: ChipStates & {
    semantic?: ChipStates;
  };
};

type ChipStates = {
  default: ChipColors;
  hover?: ChipColors;
  focus?: ChipColors;
  activated?: ChipColors;
  disabled?: ChipColors;
};

// Basic colors for a state
type ChipColors = {
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
