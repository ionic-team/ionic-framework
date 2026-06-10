import type { IonMargin } from '../../themes/themes.interfaces';

export type IonSkeletonTextRecipe = {
  animated?: {
    background?: {
      /** Opacity of the animated shimmer highlight, from 0 to 1. */
      alpha?: string | number;

      /** Highlight color of the animated shimmer, in RGB format (e.g. `255, 0, 0`). */
      rgb?: string;
    };
  };

  border?: {
    radius?: string;
  };

  default?: {
    background?: {
      /** Opacity of the background when it's not being animated, from 0 to 1. */
      alpha?: string | number;

      /** Background color when it's not being animated in RGB format (e.g. `255, 0, 0`), also the base of the animated shimmer. */
      rgb?: string;
    };
  };

  lineHeight?: string;

  margin?: Omit<IonMargin, 'end' | 'start'>;
};
