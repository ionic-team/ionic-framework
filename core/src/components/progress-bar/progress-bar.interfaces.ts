export type IonProgressBarRecipe = {
  height?: string | number;

  indeterminate?: {
    progress?: {
      default?: {
        background?: string;
      };

      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        default?: {
          background?: string;
        };
      };
    };

    buffer?: {
      bar?: {
        default?: {
          background?: string;
        };

        /** Any of the semantic colors like primary, secondary, etc. */
        semantic?: {
          default?: {
            background?: string;
          };
        };

        solid?: {
          default?: {
            background?: string;
          };
        };
      };
    };
  };

  determinate?: {
    progress?: {
      default?: {
        background?: string;
      };

      /** Any of the semantic colors like primary, secondary, etc. */
      semantic?: {
        default?: {
          background?: string;
        };
      };
    };

    buffer?: {
      bar?: {
        default?: {
          background?: string;
        };

        /** Any of the semantic colors like primary, secondary, etc. */
        semantic?: {
          default?: {
            background?: string;
          };
        };

        /* When progress bar is solid (buffer = 1) */
        solid?: {
          default?: {
            background?: string;
          };
        };
      };

      circles?: {
        default?: {
          background?: string;
        };

        /** Any of the semantic colors like primary, secondary, etc. */
        semantic?: {
          default?: {
            background?: string;
          };
        };
      };
    };
  };

  // Shapes
  shape?: {
    [K in IonProgressBarShape]?: IonProgressBarShapeDefinition;
  };
};

type IonProgressBarShapeDefinition = {
  border?: {
    radius?: string | number;
  };
};

export type IonProgressBarConfig = {
  shape?: IonProgressBarShape;
};

export type IonProgressBarShape = 'round' | 'rectangular';
