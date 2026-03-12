import type { IonPadding, IonMargin } from '../../themes/themes.interfaces';

export type IonItemDividerRecipe = {
  background?: string;
  color?: string;
  minHeight?: string;
  zIndex?: number;

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
    anchor?: {
      margin?: IonMargin;
    };

    edge?: {
      margin?: IonMargin;
    };
  };

  trailing?: {
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
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
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
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
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
      edge?: {
        margin?: IonMargin;
      };
    };

    trailing?: {
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

    trailing?: {
      margin?: IonMargin;
    };
  };

  header3?: {
    margin?: IonMargin;

    trailing?: {
      margin?: IonMargin;
    };
  };

  header4?: {
    margin?: IonMargin;

    trailing?: {
      margin?: IonMargin;
    };
  };

  header5?: {
    margin?: IonMargin;

    trailing?: {
      margin?: IonMargin;
    };
  };

  header6?: {
    margin?: IonMargin;

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

    trailing?: {
      margin?: IonMargin;
    };
  };
};
