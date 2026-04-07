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

  min?: {
    width?: string;
  };

  padding?: IonPadding;
};

type IonBadgeSizeContentDefinition = IonBadgeSizeDefinition & {
  letterSpacing?: string | number;

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

type IonBadgeSizeDotDefinition = IonBadgeSizeDefinition;

export type IonBadgeHue = 'bold' | 'subtle';
export type IonBadgeShape = 'crisp' | 'soft' | 'round' | 'rectangular';
export type IonBadgeSize = 'small' | 'medium' | 'large';
type IonBadgeType = 'content' | 'dot';
