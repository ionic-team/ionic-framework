import type { IonMargin } from '../../themes/themes.interfaces';

export type IonDividerRecipe = {
  /** Color of the divider line. */
  color?: string;

  /** Applies for each value of the `spacing` property, except `"none"`, which is always 0. */
  spacing?: {
    [K in Exclude<IonDividerSpacing, 'none'>]?: {
      /** Space above and below the line. Collapses with the margins of adjacent elements. */
      margin?: Pick<IonMargin, 'top' | 'bottom'>;
    };
  };

  /** Thickness of the divider line. */
  thickness?: string;
};

export type IonDividerConfig = {
  /** Spacing used when the `spacing` property is not set. */
  spacing?: IonDividerSpacing;
};

export const ION_DIVIDER_SPACINGS = ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;
export type IonDividerSpacing = (typeof ION_DIVIDER_SPACINGS)[number];
