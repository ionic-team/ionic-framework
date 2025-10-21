import type { IonicConfig } from '../utils/config';

// Platform-specific theme
export type PlatformTheme = Omit<BaseTheme, 'ios' | 'md'>;

// Base tokens for all palettes
export type BaseTheme = {
  // GLOBAL THEME TOKENS
  backgroundColor?: string;
  backgroundColorRgb?: string;
  textColor?: string;
  textColorRgb?: string;
  backgroundColorStep?: {
    [key: string]: string;
  };
  textColorStep?: {
    [key: string]: string;
  };

  // SPACE TOKENS
  spacing?: {
    0?: string;
    25?: string;
    50?: string;
    75?: string;
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
    950?: string;
    1000?: string;
    1050?: string;
    1100?: string;
    1150?: string;
    1200?: string;
    xxxxs?: string;
    xxxs?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    xxxl?: string;
    xxxxl?: string;
  };

  scaling?: {
    0?: string;
    25?: string;
    50?: string;
    75?: string;
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
    950?: string;
    1000?: string;
    1050?: string;
    1100?: string;
    1150?: string;
    1200?: string;
    1400?: string;
    1600?: string;
    1800?: string;
    2000?: string;
    2400?: string;
    2800?: string;
    3200?: string;
    3400?: string;
    3600?: string;
    4000?: string;
    5000?: string;
    6200?: string;
    7400?: string;
    9000?: string;
    xxxxs?: string;
    xxxs?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    xxxl?: string;
    xxxxl?: string;
  };

  // APPEARANCE TOKENS
  borderWidth?: {
    0?: string;
    25?: string;
    50?: string;
    75?: string;
    100?: string;
    150?: string;
    200?: string;
    250?: string;
    300?: string;
    350?: string;
    400?: string;
    xxxxs?: string;
    xxxs?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    xxxl?: string;
    xxxxl?: string;
    hairline?: string;
  };

  radii?: {
    0?: string;
    25?: string;
    50?: string;
    75?: string;
    100?: string;
    150?: string;
    200?: string;
    250?: string;
    300?: string;
    350?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    1000?: string;
    xxxxs?: string;
    xxxs?: string;
    xxs?: string;
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    xxxl?: string;
    xxxxl?: string;
    full?: string;
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
  name?: string;

  palette?: {
    light?: LightTheme;
    dark?: DarkTheme;
  };

  config?: IonicConfig;
};
