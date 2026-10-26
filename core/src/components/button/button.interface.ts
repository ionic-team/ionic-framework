import type { Hue, IonMargin, IonPadding } from '../../themes/themes.interfaces';
import type { SpinnerSize } from '../spinner/spinner.interfaces';

export const ION_BUTTON_FILLS = ['clear', 'outline', 'solid'] as const;
export type IonButtonFill = (typeof ION_BUTTON_FILLS)[number];

export const ION_BUTTON_SHAPES = ['crisp', 'soft', 'round', 'rectangular'] as const;
export type IonButtonShape = (typeof ION_BUTTON_SHAPES)[number];

export const ION_BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type IonButtonSize = (typeof ION_BUTTON_SIZES)[number];

export const ION_BUTTON_EXPANDS = ['block', 'full'] as const;
export type IonButtonExpand = (typeof ION_BUTTON_EXPANDS)[number];

export type IonButtonRecipe = {
  margin?: IonMargin;
  transition?: string;

  font?: {
    family?: string;
  };

  letter?: {
    spacing?: string | number;
  };

  text?: {
    transform?: string;
  };

  // Hues with fills
  hue?: {
    [K in Hue]?: IonButtonFillDefinition;
  };

  // Sizes
  size?: {
    [K in IonButtonSize]?: IonButtonSizeDefinition;
  };

  // Shapes
  shape?: {
    [K in IonButtonShape]?: IonButtonShapeDefinition;
  };

  // Shared states
  state?: {
    focus?: {
      ring?: {
        color?: string;
        offset?: string | number;
        style?: string;
        width?: string | number;
      };
    };
  };
};

type IonButtonFillDefinition = {
  [K in IonButtonFill]?: IonButtonStateDefinition & {
    default?: {
      font?: {
        weight?: string | number;
      };
    };

    /** A `strong` button */
    strong?: {
      font?: {
        weight?: string | number;
      };
    };

    rippleEffect?: IonButtonRippleEffectDefinition;

    /** When the button has a `color` */
    semantic?: IonButtonSemanticDefinition & {
      rippleEffect?: IonButtonRippleEffectDefinition;
    };
  };
};

type IonButtonStateDefinition = {
  default?: IonButtonColorDefinition & {
    border?: {
      color?: string;
      style?: string;
      width?: string | number;
    };

    box?: {
      shadow?: string;
    };
  };

  hover?: IonButtonColorDefinition & {
    box?: {
      shadow?: string;
    };

    /** The whole button, for fills that fade instead of changing color */
    opacity?: string | number;
  };

  focus?: IonButtonColorDefinition & {
    box?: {
      shadow?: string;
    };
  };

  activated?: IonButtonColorDefinition & {
    /** The whole button, for fills that fade instead of changing color */
    opacity?: string | number;

    box?: {
      shadow?: string;
    };
  };

  /** Unset colors keep the default ones */
  disabled?: {
    background?: string;

    border?: {
      color?: string;
    };

    box?: {
      shadow?: string;
    };

    color?: string;

    /** The whole button */
    opacity?: string | number;
  };
};

/** The states of a button with a `color` */
type IonButtonSemanticDefinition = {
  default?: IonButtonColorDefinition & {
    border?: {
      color?: string;
    };
  };

  hover?: IonButtonColorDefinition;

  focus?: IonButtonColorDefinition;

  activated?: IonButtonColorDefinition;

  /** Unset colors keep the default ones */
  disabled?: {
    background?: string;

    border?: {
      color?: string;
    };

    color?: string;
  };
};

/** The ripple shown while the button is pressed, which only renders in `md` mode */
type IonButtonRippleEffectDefinition = {
  color?: string;
  opacity?: string | number;
};

type IonButtonColorDefinition = {
  background?: string;
  color?: string;
};

type IonButtonIconDefinition = {
  font?: {
    size?: string | number;
  };

  /** Icon in the `start` slot */
  leading?: {
    margin?: IonMargin;
  };

  /** Icon in the `end` slot */
  trailing?: {
    margin?: IonMargin;
  };
};

/** A spinner in the `start`, `end` or `icon-only` slot */
type IonButtonSpinnerDefinition = {
  /** Unset sizes keep the spinner's own size */
  size?: {
    [K in SpinnerSize]?: {
      height?: string | number;
      width?: string | number;
    };
  };

  /** Spinner in the `start` slot */
  leading?: {
    margin?: IonMargin;
  };

  /** Spinner in the `end` slot */
  trailing?: {
    margin?: IonMargin;
  };
};

/** A button whose only content is an icon in the `icon-only` slot */
type IonButtonIconOnlyDefinition = {
  padding?: IonPadding;

  icon?: {
    font?: {
      size?: string | number;
    };
  };
};

type IonButtonSizeDefinition = {
  font?: {
    size?: string | number;
  };

  min?: {
    /** Also the width and height of an icon-only button, so it's a square as tall as a text button */
    height?: string | number;
    width?: string | number;
  };

  padding?: IonPadding;

  icon?: IonButtonIconDefinition;
  iconOnly?: IonButtonIconOnlyDefinition;
  spinner?: IonButtonSpinnerDefinition;

  /** A badge without a `vertical` position, which sits after the label of a text button */
  badge?: {
    margin?: IonMargin;
  };
};

type IonButtonShapeDefinition = {
  border?: {
    radius?: string | number;
  };
};

export type IonButtonConfig = {
  fill?: IonButtonFill;
  hue?: Hue;
  shape?: IonButtonShape;
  size?: IonButtonSize;
};
