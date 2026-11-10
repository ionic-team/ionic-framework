import type { Hue } from '../../themes/themes.interfaces';

type IonRouterLinkStateDefinition = {
  color?: string;
};

export type IonRouterLinkRecipe = {
  hue?: {
    [K in Hue]?: {
      activated?: IonRouterLinkStateDefinition;
      default?: IonRouterLinkStateDefinition;

      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        activated?: IonRouterLinkStateDefinition;
        default?: IonRouterLinkStateDefinition;
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
      ring?: {
        color?: string;
        radius?: string;
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
