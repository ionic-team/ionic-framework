export type IonProgressBarRecipe = {
  height?: string | number;

  // Indeterminate type (animated, no specific value)
  indeterminate?: {
    progress?: {
      default?: {
        background?: string;
      };
      semantic?: {
        // Default state of the semantic color (not hover, focus, activated, etc.)
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

  // Determinate type (has a specific value, optional buffer)
  // it has three parts:
  // - progress: the progress bar which represents the current value
  // - buffer-bar: the buffer bar which represents the buffer value
  // - buffer-circles: the buffer circles which are displayed when there is a buffer value but no progress value (value = 0, buffer > 0), this is optional
  determinate?: {
    progress?: {
      default?: {
        background?: string;
      };
      semantic?: {
        // Default state of the semantic color (not hover, focus, activated, etc.)
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
        semantic?: {
          default?: {
            background?: string;
          };
        };
        // When progress bar is solid (buffer = 1)
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
        semantic?: {
          default?: {
            background?: string;
          };
        };
        // When progress bar is solid (buffer = 1)
        solid?: {
          default?: {
            background?: string;
          };
        };
      };
    };
  };

  // Shape variants
  shape?: {
    round?: {
      border?: {
        radius?: string | number;
      };
    };
    rectangular?: {
      border?: {
        radius?: string | number;
      };
    };
  };
};

export type IonProgressBarConfig = {
  shape?: IonProgressBarShape;
};

export type IonProgressBarShape = 'round' | 'rectangular';
