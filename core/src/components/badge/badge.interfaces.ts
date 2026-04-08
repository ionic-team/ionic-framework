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
  height?: string;

  min?: {
    width?: string;
  };
};

export type IonBadgeConfig = {
  hue?: IonBadgeHue;
  size?: IonBadgeSize;
  shape?: IonBadgeShape;
};

export type IonBadgeHue = 'bold' | 'subtle';
export type IonBadgeShape = 'crisp' | 'soft' | 'round' | 'rectangular';
export type IonBadgeSize = 'small' | 'medium' | 'large';
export type IonBadgeVerticalPosition = 'top' | 'bottom';
