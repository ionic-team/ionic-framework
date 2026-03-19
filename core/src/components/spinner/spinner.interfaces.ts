export interface SpinnerTemplates {
  [spinnerName: string]: SpinnerTemplate;
}

export interface SpinnerTemplate {
  dur: number;
  circles?: number;
  lines?: number;
  elmDuration?: boolean;
  fn: (dur: number, index: number, total: number) => SpinnerData;
}

interface SpinnerData {
  r?: number;
  y1?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  style: { [key: string]: string | undefined };
  viewBox?: string;
  transform?: string;
}

export type IonSpinnerRecipe = {
  color?: string;

  lines?: {
    stroke?: {
      width?: string;
    };

    small?: {
      stroke?: {
        width?: string;
      };
    };

    sharp?: {
      stroke?: {
        width?: string;
      };

      small?: {
        stroke?: {
          width?: string;
        };
      };
    };
  };

  circular?: {
    stroke?: {
      width?: string;
    };
  };

  crescent?: {
    stroke?: {
      width?: string;
    };
  };

  // Sizes
  size?: {
    [K in SpinnerSize]?: IonSpinnerSizeDefinition;
  };
};

type IonSpinnerSizeDefinition = {
  width?: string;
  height?: string;
};

export type IonSpinnerConfig = {
  size?: SpinnerSize;
};

export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
