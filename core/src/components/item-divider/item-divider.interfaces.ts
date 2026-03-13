import type { IonPadding, IonMargin } from '../../themes/themes.interfaces';

export type IonItemDividerRecipe = {
  background?: string;
  color?: string;
  minHeight?: string;

  padding?: IonPadding;

  inner?: {
    padding?: IonPadding;
  };

  border?: {
    bottom?: string;
  };

  font?: {
    size?: string;
    weight?: string;
  };

  leading?: {
    // Targets `:host([slot="start"])`
    anchor?: {
      margin?: IonMargin;
    };

    // Targets `::slotted([slot="start"])`
    edge?: {
      margin?: IonMargin;
    };
  };

  trailing?: {
    // Targets `::slotted([slot="end"])`
    edge?: {
      margin?: IonMargin;
    };
  };

  label?: {
    margin?: IonMargin;
  };

  icon?: {
    font?: {
      size?: string;
    };

    leading?: {
      // Targets `::slotted([slot="start"])`
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
      // Targets `::slotted([slot="end"])`
      edge?: {
        margin?: IonMargin;
      };
    };

    default?: {
      color?: string;
    };

    semantic?: {
      default?: {
        color?: string;
      };
    };
  };

  note?: {
    align?: {
      self?: string;
    };

    font?: {
      size?: string;
    };

    margin?: IonMargin;
    padding?: IonPadding;
  };

  avatar?: {
    height?: string;
    width?: string;

    margin?: IonMargin;

    leading?: {
      // Targets `::slotted([slot="start"])`
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
      // Targets `::slotted([slot="end"])`
      edge?: {
        margin?: IonMargin;
      };
    };
  };

  thumbnail?: {
    height?: string;
    width?: string;

    margin?: IonMargin;

    leading?: {
      // Targets `::slotted([slot="start"])`
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
      // Targets `::slotted([slot="end"])`
      edge?: {
        margin?: IonMargin;
      };
    };
  };

  header1?: {
    margin?: IonMargin;
  };

  header2?: {
    margin?: IonMargin;

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };

  header3?: {
    margin?: IonMargin;

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };

  header4?: {
    margin?: IonMargin;

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };

  header5?: {
    margin?: IonMargin;

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };

  header6?: {
    margin?: IonMargin;

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };

  paragraph?: {
    color?: string;
    overflow?: string;

    margin?: IonMargin;

    font?: {
      size?: string;
    };

    text?: {
      overflow?: string;
    };

    // Targets `:last-child`
    trailing?: {
      margin?: IonMargin;
    };
  };
};
