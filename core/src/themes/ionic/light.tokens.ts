import type { LightTheme } from '../themes.interfaces';

// TODO(): this should be removed when we update the ionic theme
export const lightTheme: LightTheme = {
  color: {
    primary: {
      bold: {
        base: '#105cef', // $ion-bg-primary-base-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#0d4bc3', // $ion-bg-primary-base-press
        tint: '#6986f2', // $ion-semantics-primary-600
        foreground: '#0d4bc3', // $ion-text-primary
      },
      subtle: {
        base: '#f2f4fd', // $ion-bg-primary-subtle-default
        contrast: '#0d4bc3', // $ion-text-primary
        shade: '#d0d7fa', // $ion-bg-primary-subtle-press
        tint: '#e9ecfc', // $ion-semantics-primary-200
        foreground: '#0d4bc3', // $ion-text-primary
      },
    },
    secondary: {
      bold: {
        base: '#0d4bc3', // $ion-bg-info-base-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#09358a', // $ion-bg-info-base-press
        tint: '#105cef', // $ion-semantics-info-700
        foreground: '#0d4bc3', // $ion-text-info
      },
      subtle: {
        base: '#f2f4fd', // $ion-bg-info-subtle-default
        contrast: '#0d4bc3', // $ion-text-info
        shade: '#d0d7fa', // $ion-bg-info-subtle-press
        tint: '#e9ecfc', // $ion-semantics-info-200
        foreground: '#0d4bc3', // $ion-text-info
      },
    },
    tertiary: {
      bold: {
        base: '#7c20f2', // $ion-primitives-violet-700
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#711ddd', // $ion-primitives-violet-800
        tint: '#9a6cf4', // $ion-primitives-violet-600
        foreground: '#7c20f2', // $ion-primitives-violet-700
      },
      subtle: {
        base: '#f5f2fe', // $ion-primitives-violet-100
        contrast: '#7c20f2', // $ion-primitives-violet-700
        shade: '#dcd1fb', // $ion-primitives-violet-300
        tint: '#eee9fd', // $ion-primitives-violet-200
        foreground: '#7c20f2', // $ion-primitives-violet-700
      },
    },
    success: {
      bold: {
        base: '#126f23', // $ion-bg-success-base-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#093811', // $ion-bg-success-base-press
        tint: '#178a2b', // $ion-semantics-success-800
        foreground: '#126f23', // $ion-text-success
      },
      subtle: {
        base: '#ebf9ec', // $ion-bg-success-subtle-default
        contrast: '#126f23', // $ion-text-success
        shade: '#b3ebb7', // $ion-bg-success-subtle-press
        tint: '#dcf5de', // $ion-semantics-success-200
        foreground: '#126f23', // $ion-text-success
      },
    },
    warning: {
      bold: {
        base: '#ffd600', // $ion-bg-warning-base-default
        contrast: '#242424', // $ion-text-default
        shade: '#df9c00', // $ion-bg-warning-base-press
        tint: '#ffebb1', // $ion-primitives-yellow-300
        foreground: '#704b02', // $ion-text-warning
      },
      subtle: {
        base: '#fff5db', // $ion-bg-warning-subtle-default
        contrast: '#704b02', // $ion-text-warning
        shade: '#ffe07b', // $ion-bg-warning-subtle-press
        tint: '#fff9ea', // $ion-primitives-yellow-100
        foreground: '#704b02', // $ion-text-warning
      },
    },
    danger: {
      bold: {
        base: '#bf2222', // $ion-bg-danger-base-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#761515', // $ion-bg-danger-base-press
        tint: '#e52929', // $ion-semantics-danger-700
        foreground: '#991b1b', // $ion-text-danger
      },
      subtle: {
        base: '#feeded', // $ion-bg-danger-subtle-default
        contrast: '#991b1b', // $ion-text-danger
        shade: '#fcc1c1', // $ion-bg-danger-subtle-press
        tint: '#fde1e1', // $ion-semantics-danger-200
        foreground: '#991b1b', // $ion-text-danger
      },
    },
    light: {
      bold: {
        base: '#a2a2a2', // $ion-bg-neutral-base-default
        contrast: '#242424', // $ion-text-default
        shade: '#8c8c8c', // $ion-primitives-neutral-600
        tint: '#d5d5d5', // $ion-primitives-neutral-400
        foreground: '#242424', // $ion-text-default
      },
      subtle: {
        base: '#ffffff', // $ion-bg-neutral-subtlest-default
        contrast: '#242424', // $ion-text-default
        shade: '#efefef', // $ion-bg-neutral-subtlest-press
        tint: '#f5f5f5', // $ion-primitives-neutral-100
        foreground: '#242424', // $ion-text-default
      },
    },
    medium: {
      bold: {
        base: '#3b3b3b', // $ion-bg-neutral-bold-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#242424', // $ion-bg-neutral-bold-press
        tint: '#4e4e4e', // $ion-primitives-neutral-900
        foreground: '#242424', // $ion-text-default
      },
      subtle: {
        base: '#efefef', // $ion-bg-neutral-subtle-default
        contrast: '#626262', // $ion-text-subtlest
        shade: '#d5d5d5', // $ion-bg-neutral-subtle-press
        tint: '#f5f5f5', // $ion-primitives-neutral-100
        foreground: '#242424', // $ion-text-default
      },
    },
    dark: {
      bold: {
        base: '#242424', // $ion-bg-neutral-boldest-default
        contrast: '#ffffff', // $ion-text-inverse
        shade: '#111111', // $ion-bg-neutral-boldest-press
        tint: '#292929', // $ion-primitives-neutral-1100
        foreground: '#242424', // $ion-text-default
      },
      subtle: {
        base: '#efefef', // $ion-bg-neutral-subtle-default
        contrast: '#3b3b3b', // $ion-text-subtle
        shade: '#d5d5d5', // $ion-bg-neutral-subtle-press
        tint: '#f5f5f5', // $ion-primitives-neutral-100
        foreground: '#242424', // $ion-text-default
      },
    },
  },
};
