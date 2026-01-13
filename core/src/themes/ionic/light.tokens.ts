import * as colorTokens from 'outsystems-design-tokens/tokens/color scheme.json';
import * as primitiveTokens from 'outsystems-design-tokens/tokens/primitives.json';
import * as lightTokens from 'outsystems-design-tokens/tokens/theme/light.json';
import * as typographyTokens from 'outsystems-design-tokens/tokens/typography.json';

import { cachedResolveOsToken } from '../../utils/theme';
import type { LightTheme } from '../themes.interfaces';

const tokenMap = {
  colorTokens,
  lightTokens,
  primitiveTokens,
  typographyTokens,
};

export const lightTheme: LightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',

  color: {
    primary: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.primary.base.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.primary, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.primary.base.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.primary['600'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.primary.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.primary, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.primary, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.primary.subtle.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.primary['200'], tokenMap),
      },
    },
    secondary: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.info.base.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.primary, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.info.base.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.info['700'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.info.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.info, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.info, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.info.subtle.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.info['200'], tokenMap),
      },
    },
    tertiary: {
      bold: {
        base: cachedResolveOsToken(lightTokens.primitives.violet['700'], tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(lightTokens.primitives.violet['700'], tokenMap),
        shade: cachedResolveOsToken(lightTokens.primitives.violet['800'], tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.primary['600'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(lightTokens.primitives.violet['100'], tokenMap),
        contrast: cachedResolveOsToken(lightTokens.primitives.violet['700'], tokenMap),
        foreground: cachedResolveOsToken(lightTokens.primitives.violet['700'], tokenMap),
        shade: cachedResolveOsToken(lightTokens.primitives.violet['300'], tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.violet['200'], tokenMap),
      },
    },
    success: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.success.base.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.success, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.success.base.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.success['800'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.success.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.success, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.success, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.success.subtle.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.success['200'], tokenMap),
      },
    },
    warning: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.warning.base.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.warning, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.warning.base.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.yellow['300'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.warning.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.warning, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.warning, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.warning.subtle.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.yellow['100'], tokenMap),
      },
    },
    danger: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.danger.base.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.danger, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.danger.base.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.danger['700'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.danger.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.danger, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.danger, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.danger.subtle.press, tokenMap),
        tint: cachedResolveOsToken(colorTokens.semantics.danger['200'], tokenMap),
      },
    },
    light: {
      bold: {
        base: cachedResolveOsToken(lightTokens.primitives.base.white, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(lightTokens.primitives.neutral['600'], tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['400'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.neutral.subtlest.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.neutral.subtlest.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['100'], tokenMap),
      },
    },
    medium: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.neutral.bold.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.neutral.bold.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['900'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.neutral.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.subtlest, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.neutral.subtle.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['100'], tokenMap),
      },
    },
    dark: {
      bold: {
        base: cachedResolveOsToken(colorTokens.bg.neutral.boldest.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.inverse, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.neutral.boldest.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['1100'], tokenMap),
      },
      subtle: {
        base: cachedResolveOsToken(colorTokens.bg.neutral.subtle.default, tokenMap),
        contrast: cachedResolveOsToken(colorTokens.text.subtle, tokenMap),
        foreground: cachedResolveOsToken(colorTokens.text.default, tokenMap),
        shade: cachedResolveOsToken(colorTokens.bg.neutral.subtle.press, tokenMap),
        tint: cachedResolveOsToken(lightTokens.primitives.neutral['100'], tokenMap),
      },
    },
  },

  components: {
    IonCard: {
      background: '#ffffff',
    },
    IonItem: {
      background: '#ffffff',
    },
    IonTabBar: {
      background: 'var(--ion-tab-bar-background, #ffffff)',
      backgroundActivated: 'var(--ion-tab-bar-background-activated, #f2f4fd)',
      backgroundFocused: 'var(--ion-tab-bar-background-focused, transparent)',
      color: 'var(--ion-tab-bar-color, #626262)',
      colorSelected: 'var(--ion-tab-bar-color-selected, #0d4bc3)',
      borderColor: 'var(--ion-tab-bar-border-color, transparent)',
    },
  },
};
