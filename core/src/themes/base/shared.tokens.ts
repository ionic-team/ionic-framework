/**
 * Tokens shared between the theme files.
 */

const hexColors = {
  white: '#ffffff',
  black: '#000000',
};

const rgbColors = {
  white: '255, 255, 255',
  black: '0, 0, 0',
};

export const colors = {
  ...hexColors,

  backgroundColor: `var(--ion-background-color, ${hexColors.white})`,
  backgroundColorRgb: `var(--ion-background-color-rgb, ${rgbColors.white})`,

  textColor: `var(--ion-text-color, ${hexColors.black})`,
  textColorRgb: `var(--ion-text-color-rgb, ${rgbColors.black})`,
};
