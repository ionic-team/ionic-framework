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

  /** Targets `[slot="start"]` */
  start?: {
    /** Targets `::slotted([slot="start"])` */
    slotted?: {
      margin?: IonMargin;
    };
  };

  /** Targets `[slot="end"]` */
  end?: {
    /** Targets `::slotted([slot="end"])` */
    slotted?: {
      margin?: IonMargin;
    };
  };

  /** Targets `::slotted(ion-label)` */
  label?: {
    margin?: IonMargin;
  };

  /** Targets `::slotted(ion-icon)` */
  icon?: {
    font?: {
      size?: string;
    };

    /** Targets `[slot="start"]` */
    start?: {
      /** Targets `::slotted(ion-icon[slot="start"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };

    /** Targets `[slot="end"]` */
    end?: {
      /** Targets `::slotted(ion-icon[slot="end"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };

    /** Default non-semantic states */
    default?: {
      color?: string;
    };

    /** Any of the semantic colors like primary, secondary, etc. */
    semantic?: {
      default?: {
        color?: string;
      };
    };
  };

  /** Targets `::slotted(ion-note)` */
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

  /** Targets `::slotted(ion-avatar)` */
  avatar?: {
    height?: string;
    width?: string;

    margin?: IonMargin;

    /** Targets `[slot="start"]` */
    start?: {
      /** Targets `::slotted(ion-avatar[slot="start"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };

    /** Targets `[slot="end"]` */
    end?: {
      /** Targets `::slotted(ion-avatar[slot="end"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };
  };

  /** Targets `::slotted(ion-thumbnail)` */
  thumbnail?: {
    height?: string;
    width?: string;

    margin?: IonMargin;

    /** Targets `[slot="start"]` */
    start?: {
      /** Targets `::slotted(ion-thumbnail[slot="start"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };

    /** Targets `[slot="end"]` */
    end?: {
      /** Targets `::slotted(ion-thumbnail[slot="end"])` */
      slotted?: {
        margin?: IonMargin;
      };
    };
  };

  /** Targets `::slotted(p)` */
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

    /** Targets `::slotted(p:last-child)` */
    trailing?: {
      margin?: IonMargin;
    };
  };
};
