import type { IonPadding, IonMargin } from '../../themes/themes.interfaces.js';

export type IonChipRecipe = {
  cursor?: string;
  margin?: IonMargin;

  font?: {
    weight?: string | number;
  };

  gap?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;

  padding?: IonPadding;

  // Sizes
  size: {
    small: IonChipSizeDefinition;
    large: IonChipSizeDefinition;
  };

  // States
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

  // Shapes
  shape: {
    soft: IonChipShapeDefinition;
    round: IonChipShapeDefinition;
    rectangular: IonChipShapeDefinition;
  };

  // Hues
  hue?: {
    bold?: IonChipHueDefinition;
    subtle?: IonChipHueDefinition;
  };

  // Fills

  fill?: {
    outline?: {
      bg?: string;

      border?: {
        color?: HueRef;
        style?: string;
        width?: string | number;
      };

      // Any of the semantic colors like primary, secondary, etc.
      semantic?: {
        bg?: HueRef;

        border?: {
          color?: HueRef;
        };
      };

      state?: IonChipVariantState;
    };
  };

  icon?: IonChipIconDefinition;
  avatar?: IonChipAvatarDefinition;
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

type IonChipHueDefinition = {
  bg?: string;
  color?: string;

  semantic?: {
    bg?: string;
    color?: string;
    state?: IonChipInteractionStates;
  };

  state?: IonChipInteractionStates;
};

type IonChipInteractionStates = {
  focus?: {
    bg?: string;
  };

  hover?: {
    bg?: string;
  };

  activated?: {
    bg?: string;
  };
};

type IonChipVariantState = {
  focus?: {
    bg?: HueRef;
  };
  hover?: {
    bg?: HueRef;
  };
  activated?: {
    bg?: HueRef;
  };
};

type HueRef = {
  bold?: string;
  subtle?: string;
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
  hue?: 'bold' | 'subtle';
  size?: 'small' | 'large';
  shape?: 'soft' | 'round' | 'rectangular';
};
