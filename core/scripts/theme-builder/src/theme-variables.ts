import { Color } from './components/Color';

export interface ThemeVariable {
  property: string;
  quickPick?: { text: string };
  value?: Color | number | string;
  computed?: { type: ComputedType, params: any };
}

export enum ComputedType {
  rgblist = 'computed-rgblist',
  step = 'computed-step'
}

export const THEME_VARIABLES: ThemeVariable[] = [
  {
    property: '--ion-alpha-activated'
  },
  {
    property: '--ion-alpha-border-low'
  },
  {
    property: '--ion-alpha-border-medium'
  },
  {
    property: '--ion-alpha-border-high'
  },
  {
    property: '--ion-alpha-disabled'
  },
  {
    property: '--ion-alpha-focused'
  },
  {
    property: '--ion-alpha-hover'
  },
  {
    property: '--ion-alpha-lowest'
  },
  {
    property: '--ion-alpha-low'
  },
  {
    property: '--ion-alpha-medium'
  },
  {
    property: '--ion-alpha-high'
  },
  {
    property: '--ion-alpha-highest'
  },
  {
    property: '--ion-color-primary',
    quickPick: {text: 'p'}
  },
  {
    property: '--ion-color-primary-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-primary'}
    }
  },
  {
    property: '--ion-color-primary-contrast'
  },
  {
    property: '--ion-color-primary-contrast-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-primary-contrast'}
    }
  },
  {
    property: '--ion-color-primary-shade'
  },
  {
    property: '--ion-color-primary-tint'
  },
  {
    property: '--ion-color-secondary',
    quickPick: {text: 's'}
  },
  {
    property: '--ion-color-secondary-contrast'
  },
  {
    property: '--ion-color-secondary-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-secondary'}
    }
  },
  {
    property: '--ion-color-secondary-shade'
  },
  {
    property: '--ion-color-secondary-tint'
  },
  {
    property: '--ion-color-tertiary',
    quickPick: {text: 't'}
  },
  {
    property: '--ion-color-tertiary-contrast'
  },
  {
    property: '--ion-color-tertiary-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-tertiary'}
    }
  },
  {
    property: '--ion-color-tertiary-shade'
  },
  {
    property: '--ion-color-tertiary-tint'
  },
  {
    property: '--ion-color-success',
    quickPick: {text: 'ss'}
  },
  {
    property: '--ion-color-success-contrast'
  },
  {
    property: '--ion-color-success-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-success'}
    }
  },
  {
    property: '--ion-color-success-shade'
  },
  {
    property: '--ion-color-success-tint'
  },
  {
    property: '--ion-color-warning',
    quickPick: {text: 'w'}
  },
  {
    property: '--ion-color-warning-contrast'
  },
  {
    property: '--ion-color-warning-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-warning'}
    }
  },
  {
    property: '--ion-color-warning-shade'
  },
  {
    property: '--ion-color-warning-tint'
  },
  {
    property: '--ion-color-danger',
    quickPick: {text: 'd'}
  },
  {
    property: '--ion-color-danger-contrast'
  },
  {
    property: '--ion-color-danger-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-danger'}
    }
  },
  {
    property: '--ion-color-danger-shade'
  },
  {
    property: '--ion-color-danger-tint'
  },
  {
    property: '--ion-color-light',
    quickPick: {text: 'l'}
  },
  {
    property: '--ion-color-light-contrast'
  },
  {
    property: '--ion-color-light-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-light'}
    }
  },
  {
    property: '--ion-color-light-shade'
  },
  {
    property: '--ion-color-light-tint'
  },
  {
    property: '--ion-color-medium',
    quickPick: {text: 'm'}
  },
  {
    property: '--ion-color-medium-contrast'
  },
  {
    property: '--ion-color-medium-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-medium'}
    }
  },
  {
    property: '--ion-color-medium-shade'
  },
  {
    property: '--ion-color-medium-tint'
  },
  {
    property: '--ion-color-dark',
    quickPick: {text: 'd'}
  },
  {
    property: '--ion-color-dark-contrast'
  },
  {
    property: '--ion-color-dark-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-color-dark'}
    }
  },
  {
    property: '--ion-color-dark-shade'
  },
  {
    property: '--ion-color-dark-tint'
  },
  {
    property: '--ion-backdrop-color'
  },
  {
    property: '--ion-overlay-background-color'
  },
  {
    property: '--ion-ripple-background-color'
  },
  {
    property: '--ion-background-color',
    quickPick: {
      text: 'bg'
    }
  },
  {
    property: '--ion-background-color-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-background-color'}
    }
  },
  {
    property: '--ion-background-color-step-50',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .050, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-100',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .100, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-150',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .150, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-200',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .200, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-250',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .250, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-300',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .300, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-350',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .350, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-400',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .400, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-450',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .450, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-500',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .500, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-550',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .550, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-600',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .600, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-650',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .650, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-700',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .700, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-750',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .750, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-800',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .800, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-850',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .850, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-900',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .900, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-950',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: .950, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-background-color-step-1000',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-background-color', amount: 1, from: '--ion-text-color'}
    }
  },
  {
    property: '--ion-border-color'
  },
  {
    property: '--ion-box-shadow-color'
  },
  {
    property: '--ion-text-color',
    quickPick: {
      text: 'txt'
    }
  },
  {
    property: '--ion-text-color-rgb',
    computed: {
      type: ComputedType.rgblist,
      params: {property: '--ion-text-color'}
    }
  },
  {
    property: '--ion-text-color-step-50',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .050, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-100',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .100, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-150',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .150, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-200',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .200, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-250',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .250, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-300',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .300, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-350',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .350, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-400',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .400, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-450',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .450, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-500',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .500, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-550',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .550, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-600',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .600, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-650',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .650, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-700',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .700, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-750',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .750, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-800',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .800, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-850',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .850, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-900',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .900, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-950',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: .950, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-text-color-step-1000',
    computed: {
      type: ComputedType.step,
      params: {property: '--ion-text-color', amount: 1, from: '--ion-background-color'}
    }
  },
  {
    property: '--ion-tabbar-background-color'
  },
  {
    property: '--ion-tabbar-background-color-focused'
  },
  {
    property: '--ion-tabbar-border-color'
  },
  {
    property: '--ion-tabbar-text-color'
  },
  {
    property: '--ion-tabbar-text-color-active'
  },
  {
    property: '--ion-toolbar-background-color'
  },
  {
    property: '--ion-toolbar-border-color'
  },
  {
    property: '--ion-toolbar-color-active'
  },
  {
    property: '--ion-toolbar-color-inactive'
  },
  {
    property: '--ion-toolbar-text-color'
  },
  {
    property: '--ion-item-background-color'
  },
  {
    property: '--ion-item-background-color-active'
  },
  {
    property: '--ion-item-border-color'
  },
  {
    property: '--ion-item-text-color'
  },
  {
    property: '--ion-placeholder-text-color'
  }
];
