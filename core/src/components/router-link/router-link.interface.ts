import type { Hue, IonPadding } from '../../themes/themes.interfaces';

type IonRouterLinkStateDefinition = {
  background?: string;
  color?: string;
};

export type IonRouterLinkRecipe = {
  hue?: {
    [K in Hue]?: {
      activated?: IonRouterLinkStateDefinition;
      default?: IonRouterLinkStateDefinition;
      focus?: IonRouterLinkStateDefinition;

      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        activated?: IonRouterLinkStateDefinition;
        default?: IonRouterLinkStateDefinition;
        focus?: IonRouterLinkStateDefinition;
        visited?: IonRouterLinkStateDefinition;
      };

      visited?: IonRouterLinkStateDefinition;
    };
  };

  state?: {
    activated?: {
      text?: {
        decoration?: string;
      };
    };

    focus?: {
      border?: {
        radius?: string;
      };

      padding?: IonPadding;

      ring?: {
        color?: string;
        offset?: string;
        style?: string;
        width?: string;
      };

      text?: {
        decoration?: string;
      };
    };
  };

  text?: {
    decoration?: string;
  };
};

export type IonRouterLinkConfig = {
  hue?: Hue;
};
