

export const SPINNERS: SpinnerConfigs = {

  lines: {
    dur: 1000,
    lines: 12,
    fn: (dur: number, index: number, total: number) => {
      const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 17,
        y2: 29,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  'lines-sm': {
    dur: 1000,
    lines: 12,
    fn: (dur: number, index: number, total: number) => {
      const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 12,
        y2: 20,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  bubbles: {
    dur: 1000,
    circles: 9,
    fn: (dur: number, index: number, total: number) => {
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  circles: {
    dur: 1000,
    circles: 8,
    fn: (dur: number, index: number, total: number) => {
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  crescent: {
    dur: 750,
    circles: 1,
    fn: () => {
      return {
        r: 26,
        style: {}
      };
    }
  },

  dots: {
    dur: 750,
    circles: 3,
    fn: (dur: number, index: number) => {
      const animationDelay = -(110 * index) + 'ms'; dur;
      return {
        r: 6,
        style: {
          left: (9 - (9 * index)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  }

};


export interface SpinnerConfigs {
  [spinnerName: string]: SpinnerConfig;
}


export interface SpinnerConfig {
  dur: number;
  circles?: number;
  lines?: number;
  fn: (dur: number, index: number, total: number) => SpinnerData;
}


export interface SpinnerData {
  r?: number;
  y1?: number;
  y2?: number;
  style: any;
}
