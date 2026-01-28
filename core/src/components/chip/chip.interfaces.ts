export type IonChip = {
  cursor?: string;
  margin: string | number;

  fontWeight?: string | number;
  gap?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;

  padding?: {
    vertical: string | number;
    horizontal: string | number;
  };

  // Sizes
  size: {
    small: IonChipSizeDefinition;
    large: IonChipSizeDefinition;
  };

  // States
  state?: {
    disabled?: {
      opacity: string | number;
    };

    focus?: {
      ring?: {
        color: string;
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
  hue: {
    bold: IonChipHueDefinition;
    subtle: IonChipHueDefinition;
  };

  // Variants

  variant?: {
    outline: {
      bg?: string;

      border: {
        color?: HueRef;
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

  icon: IonChipIconDefinition;
  avatar?: IonChipMediaDefinition;
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
  bg: string;
  color: string;

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
  size: string | number;

  // Styles for the media component only if it is the first element in the slot
  firstChild?: IonChipMediaMargin;
  // Styles for the media component only if it is the last element in the slot
  lastChild?: IonChipMediaMargin;
};

type IonChipMediaMargin = {
  margin?: {
    vertical?: string | number;
    start?: string | number;
    end?: string | number;
  };
};

type IonChipIconDefinition = IonChipMediaDefinition & {
  color?: string;
};

export type IonChipConfig = {
  hue?: 'bold' | 'subtle';
  size?: 'small' | 'large';
  shape?: 'soft' | 'round' | 'rectangular';
};
