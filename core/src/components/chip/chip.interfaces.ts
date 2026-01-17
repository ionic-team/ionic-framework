export type IonChip = {
  margin: string | number;
  cursor?: string;

  padding?: {
    vertical: string | number;
    horizontal: string | number;
  };

  gap?: string | number;
  lineHeight?: string | number;
  fontWeight?: string | number;
  letterSpacing?: string | number;

  // Sizes
  size: {
    small: {
      minHeight: string | number;

      font: {
        size: string | number;
      };
    };

    large: {
      minHeight: string | number;

      font: {
        size: string | number;
      };
    };
  };

  // States
  state?: {
    disabled?: {
      opacity: string | number;
    };

    focus?: {
      ring?: {
        color: string;
        width?: string | number;
      };
    };
  };

  // Shapes
  shape: {
    soft: {
      border: {
        radius: string | number;
      };
    };

    round: {
      border: {
        radius: string | number;
      };
    };

    rectangular: {
      border: {
        radius: string | number;
      };
    };
  };

  // Hues
  hue: {
    bold: {
      bg: string;
      color: string;

      // Any of the semantic colors like primary, secondary, etc.
      semantic: {
        bg?: string;
        color?: string;

        state?: {
          focus?: {
            bg?: string;
          };

          hover?: {
            bg?: string;
          };

          activated?: {
            bg?: string;
          };
        };
      };

      state?: {
        focus?: {
          bg?: string;
        };

        activated?: {
          bg: string;
        };

        hover?: {
          bg: string;
        };
      };
    };

    subtle: {
      bg: string;
      color: string;

      // Any of the semantic colors like primary, secondary, etc.
      semantic?: {
        bg?: string;
        color?: string;

        state?: {
          focus?: {
            bg?: string;
          };

          hover?: {
            bg?: string;
          };

          activated?: {
            bg?: string;
          };
        };
      };

      state?: {
        focus?: {
          bg?: string;
        };

        activated?: {
          bg: string;
        };

        hover?: {
          bg: string;
        };
      };
    };
  };

  // Variants

  variant?: {
    outline: {
      bg?: string;

      border: {
        color?: {
          bold?: string;
          subtle?: string;
        };

        width?: string | number;
      };

      // Any of the semantic colors like primary, secondary, etc.
      semantic?: {
        bg?: {
          bold?: string;
          subtle?: string;
        };

        border?: {
          color?: {
            bold?: string;
            subtle?: string;
          };
        };
      };

      state?: {
        focus?: {
          bg?: {
            bold?: string;
            subtle?: string;
          };
        };

        hover?: {
          bg?: {
            bold?: string;
            subtle?: string;
          };
        };

        activated?: {
          bg?: {
            bold?: string;
            subtle?: string;
          };
        };
      };
    };
  };

  icon: {
    size: string | number;
    color?: string;

    // Styles for the ion-icon only if it is the first element in the slot
    firstChild?: {
      margin?: {
        vertical?: string | number;
        start?: string | number;
        end?: string | number;
      };
    };

    // Styles for the ion-icon only if it is the last element in the slot
    lastChild?: {
      margin?: {
        vertical?: string | number;
        start?: string | number;
        end?: string | number;
      };
    };
  };

  avatar?: {
    size: string | number | null;

    // Styles for the ion-avatar only if it is the first element in the slot
    firstChild?: {
      margin?: {
        vertical?: string | number;
        start?: string | number;
        end?: string | number;
      };
    };

    // Styles for the ion-avatar only if it is the last element in the slot
    lastChild?: {
      margin?: {
        vertical?: string | number;
        start?: string | number;
        end?: string | number;
      };
    };
  };
};
