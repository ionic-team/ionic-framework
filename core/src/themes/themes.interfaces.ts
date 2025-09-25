// Platform-specific theme
export type PlatformTheme = Omit<BaseTheme, 'ios' | 'md'>;

// Base tokens for all palettes
export type BaseTheme = {
  // SPACE TOKENS
  spacing?: {
    none?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };

  scaling?: {
    0?: string;
    100?: string;
    150?: string;
    200?: string;
    250?: string;
    300?: string;
    350?: string;
    400?: string;
    450?: string;
    500?: string;
    550?: string;
    600?: string;
    650?: string;
    700?: string;
    750?: string;
    800?: string;
    850?: string;
    900?: string;
  };

  // APPEARANCE TOKENS
  borderWidth?: {
    none?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };

  radii?: {
    none?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };

  // TYPOGRAPHY TOKENS
  dynamicFont?: string;
  fontFamily?: string;

  fontWeight?: {
    thin?: string;
    extraLight?: string;
    light?: string;
    normal?: string;
    medium?: string;
    semiBold?: string;
    bold?: string;
    extraBold?: string;
    black?: string;
  };

  fontSize?: {
    root?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };

  lineHeight?: {
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };

  // COMPONENT OVERRIDES
  components?: {
    [key: string]: {
      [key: string]: string;
    };
  };

  // COLOR TOKENS
  color?: {
    [key: string]: {
      bold: {
        base: string;
        contrast: string;
        foreground: string;
        shade: string;
        tint: string;
      };
      subtle: {
        base: string;
        contrast: string;
        foreground: string;
        shade: string;
        tint: string;
      };
    };
  };

  // PLATFORM SPECIFIC OVERRIDES
  ios?: PlatformTheme;
  md?: PlatformTheme;
};

// Dark theme interface
export type DarkTheme = BaseTheme & {
  enabled: 'system' | 'always' | 'never' | 'class';
};

// Light theme interface
export type LightTheme = BaseTheme;

// Default theme interface
export type DefaultTheme = BaseTheme & {
  palette?: {
    light?: LightTheme;
    dark?: DarkTheme;
  };
};
