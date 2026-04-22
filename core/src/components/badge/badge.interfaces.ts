import type { IonPadding } from '../../themes/themes.interfaces';

export type IonBadgeRecipe = {
  font?: {
    family?: string;
  };

  // Hues
  hue?: {
    [K in IonBadgeHue]?: IonBadgeStateDefinition & {
      semantic?: IonBadgeStateDefinition;
    };
  };

  // Shapes
  shape?: {
    [K in IonBadgeShape]?: IonBadgeShapeDefinition;
  };

  // Sizes
  size?: {
    [K in IonBadgeSize]?: {
      /* Badge with content (i.e. text or an icon) */
      content?: IonBadgeSizeContentDefinition;

      /* Badge without content (i.e. dot badge) */
      dot?: IonBadgeSizeDotDefinition;
    };
  };
};

type IonBadgeColorDefinition = {
  background?: string;
  color?: string;
  border?: {
    radius?: string;
  };
};

type IonBadgeStateDefinition = {
  default?: IonBadgeColorDefinition;
};

type IonBadgeShapeDefinition = {
  border?: {
    radius?: string;
  };
};

type IonBadgeSizeDefinition = {
  height?: string;

  padding?: IonPadding;
};

type IonBadgeSizeContentDefinition = IonBadgeSizeDefinition & {
  letterSpacing?: string | number;

  min?: {
    height?: string;
    width?: string;
  };

  font?: {
    size?: string;
    weight?: string | number;
  };

  line?: {
    height?: string | number;
  };

  icon?: {
    width?: string;
    height?: string;
  };
};

type IonBadgeSizeDotDefinition = IonBadgeSizeDefinition & {
  min?: {
    width?: string;
  };
};

export type IonBadgeConfig = {
  hue?: IonBadgeHue;
  size?: IonBadgeSize;
  shape?: IonBadgeShape;
};

export const ION_BADGE_HUES = ['bold', 'subtle'] as const;
export type IonBadgeHue = (typeof ION_BADGE_HUES)[number];
export const ION_BADGE_SHAPES = ['crisp', 'soft', 'round', 'rectangular'] as const;
export type IonBadgeShape = (typeof ION_BADGE_SHAPES)[number];
export const ION_BADGE_SIZES = ['small', 'medium', 'large'] as const;
export type IonBadgeSize = (typeof ION_BADGE_SIZES)[number];
export const ION_BADGE_VERTICAL_POSITIONS = ['top', 'bottom'] as const;
export type IonBadgeVerticalPosition = (typeof ION_BADGE_VERTICAL_POSITIONS)[number];
