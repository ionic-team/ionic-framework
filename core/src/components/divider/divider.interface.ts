import type { IonMargin } from '../../themes/themes.interfaces';

export type IonDividerRecipe = {
  /** Color of the divider line. */
  color?: string;

  /** Applies for each value of the `spacing` property. */
  spacing?: {
    [K in IonDividerSpacing]?: {
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

export const ION_DIVIDER_SPACINGS = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;
export type IonDividerSpacing = (typeof ION_DIVIDER_SPACINGS)[number];
