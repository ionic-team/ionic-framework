import { newSpecPage } from '@stencil/core/testing';

import { Buttons } from '../../components/buttons/buttons';
import { CardContent } from '../../components/card-content/card-content';
import { Chip } from '../../components/chip/chip';
import {
  generateColorClasses,
  generateComponentsThemeCSS,
  generateCSSVars,
  generateGlobalThemeCSS,
  getClassList,
  getClassMap,
  getCustomTheme,
  hexToRgb,
  injectCSS,
  mix,
} from '../theme';

describe('getClassList()', () => {
  it('should parse string', () => {
    expect(getClassList(' class class-event     THEME-ios-bar-button')).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);
    expect(getClassList('')).toEqual([]);
    expect(getClassList('  ')).toEqual([]);
  });

  it('should pass array', () => {
    expect(getClassList(['class', 'class-event', 'THEME-ios-bar-button'])).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);
    expect(getClassList(['class   ', '   class-event', '  THEME-ios-bar-button  '])).toEqual([
      'class',
      'class-event',
      'THEME-ios-bar-button',
    ]);

    expect(
      getClassList(['class   ', null, undefined, '', '   class-event', '  ', '  THEME-ios-bar-button  '] as any)
    ).toEqual(['class', 'class-event', 'THEME-ios-bar-button']);
  });
});

describe('getClassMap()', () => {
  it('should parse string', () => {
    expect(getClassMap(' class class-event     THEME-ios-bar-button')).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });
    expect(getClassMap('')).toEqual({});
    expect(getClassMap('  ')).toEqual({});
  });

  it('should pass array', () => {
    expect(getClassMap(['class', 'class-event', 'THEME-ios-bar-button'])).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });

    expect(getClassMap(['class   ', '   class-event', '  THEME-ios-bar-button  '])).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });

    expect(
      getClassMap(['class   ', null, undefined, '', '   class-event', '  ', '  THEME-ios-bar-button  '] as any)
    ).toEqual({
      class: true,
      'class-event': true,
      'THEME-ios-bar-button': true,
    });
  });
});

describe('getCustomTheme', () => {
  const baseCustomTheme = {
    radii: {
      sm: '14px',
      md: '18px',
      lg: '22px',
    },
    components: {
      IonChip: {
        hue: {
          subtle: {
            bg: 'red',
            color: 'white',
          },
        },
      },
    },
  };

  const iosOverride = {
    components: {
      IonChip: {
        hue: {
          subtle: {
            bg: 'blue',
          },
        },
      },
    },
  };

  const mdOverride = {
    components: {
      IonChip: {
        hue: {
          subtle: {
            bg: 'green',
          },
        },
      },
    },
  };

  it('should return the custom theme if no mode overrides exist', () => {
    const customTheme = { ...baseCustomTheme };

    const result = getCustomTheme(customTheme, 'ios');

    expect(result).toEqual(customTheme);
  });

  it('should combine only with ios overrides if mode is ios', () => {
    const customTheme = {
      ...baseCustomTheme,
      ios: iosOverride,
      md: mdOverride,
    };

    const result = getCustomTheme(customTheme, 'ios');

    const expected = {
      ...baseCustomTheme,
      components: {
        IonChip: {
          hue: {
            subtle: {
              bg: 'blue',
              color: 'white',
            },
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });

  it('should combine only with md overrides if mode is md', () => {
    const customTheme = {
      ...baseCustomTheme,
      ios: iosOverride,
      md: mdOverride,
    };

    const result = getCustomTheme(customTheme, 'md');

    const expected = {
      ...baseCustomTheme,
      components: {
        IonChip: {
          hue: {
            subtle: {
              bg: 'green',
              color: 'white',
            },
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });
});

describe('generateCSSVars', () => {
  it('should not generate CSS variables for an empty theme', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {},
      },
    };

    const css = generateCSSVars(theme);
    expect(css).toBe('');
  });

  it('should generate CSS variables for a given theme', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'system',
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      config: {
        rippleEffect: true,
        formHighlight: true,
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      scaling: {
        0: '0',
      },
      radii: {
        lg: '8px',
      },
      dynamicFont: '-apple-system-body',
      fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
      fontWeights: {
        semiBold: '600',
      },
      fontSizes: {
        sm: '14px',
        md: '16px',
      },
      lineHeights: {
        sm: '1.2',
      },
      components: {},
    };

    const css = generateCSSVars(theme).replace(/\s/g, '');

    const expectedCSS = `
      --ion-border-width-sm: 4px;
      --ion-spacing-md: 12px;
      --ion-scaling-0: 0;
      --ion-radii-lg: 8px;
      --ion-dynamic-font: -apple-system-body;
      --ion-font-family: Roboto, "Helvetica Neue", sans-serif;
      --ion-font-weights-semi-bold: 600;
      --ion-font-sizes-sm: 14px;
      --ion-font-sizes-sm-rem: 0.875rem;
      --ion-font-sizes-md: 16px;
      --ion-font-sizes-md-rem: 1rem;
      --ion-line-heights-sm: 1.2;
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });
});

describe('injectCSS', () => {
  it('should inject CSS into the head', () => {
    const css = 'body { background-color: red; }';
    injectCSS(css);
    expect(document.head.innerHTML).toContain(`<style>${css}</style>`);
  });

  it('should inject CSS into an element', async () => {
    const page = await newSpecPage({
      components: [CardContent],
      html: '<ion-card-content></ion-card-content>',
    });

    const target = page.body.querySelector('ion-card-content')!;

    const css = ':host { background-color: red; }';
    injectCSS(css, target);

    expect(target.innerHTML).toContain(`<style>${css}</style>`);
  });

  it('should inject CSS into an element with a shadow root', async () => {
    const page = await newSpecPage({
      components: [Chip],
      html: '<ion-chip></ion-chip>',
    });

    const target = page.body.querySelector('ion-chip')!;
    const shadowRoot = target.shadowRoot;
    expect(shadowRoot).toBeTruthy();

    const css = ':host { background-color: red; }';
    injectCSS(css, shadowRoot!);

    expect(shadowRoot!.innerHTML).toContain(`<style>${css}</style>`);
  });

  it('should inject CSS into a scoped element', async () => {
    const page = await newSpecPage({
      components: [Buttons],
      html: '<ion-buttons></ion-buttons>',
    });

    const target = page.body.querySelector('ion-buttons')!;

    const css = ':host { background-color: red; }';
    injectCSS(css, target);

    expect(target.innerHTML).toContain(`<style>${css}</style>`);
  });
});

describe('generateGlobalThemeCSS', () => {
  it('should generate global CSS for a given theme', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'never',
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      dynamicFont: '-apple-system-body',
    };

    const css = generateGlobalThemeCSS(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root {
        --ion-border-width-sm: 4px;
        --ion-spacing-md: 12px;
        --ion-dynamic-font: -apple-system-body;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should generate global CSS for a given theme with light palette', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {
          color: {
            primary: {
              bold: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
              subtle: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
            },
            red: {
              50: '#ffebee',
              100: '#ffcdd2',
              200: '#ef9a9a',
            },
          },
        },
        dark: {
          enabled: 'never',
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      dynamicFont: '-apple-system-body',
    };

    const css = generateGlobalThemeCSS(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root {
        --ion-border-width-sm: 4px;
        --ion-spacing-md: 12px;
        --ion-dynamic-font: -apple-system-body;

        --ion-color-primary-bold: #0054e9;
        --ion-color-primary-bold-rgb: 0, 84, 233;
        --ion-color-primary-bold-contrast: #ffffff;
        --ion-color-primary-bold-contrast-rgb: 255, 255, 255;
        --ion-color-primary-bold-shade: #0041c4;
        --ion-color-primary-bold-tint: #0065ff;
        --ion-color-primary-subtle: #0054e9;
        --ion-color-primary-subtle-rgb: 0, 84, 233;
        --ion-color-primary-subtle-contrast: #ffffff;
        --ion-color-primary-subtle-contrast-rgb: 255, 255, 255;
        --ion-color-primary-subtle-shade: #0041c4;
        --ion-color-primary-subtle-tint: #0065ff;
        --ion-color-red-50: #ffebee;
        --ion-color-red-100: #ffcdd2;
        --ion-color-red-200: #ef9a9a;
      }

      :root .ion-color-primary {
        --ion-color-base: var(--ion-color-primary, var(--ion-color-primary-bold)) !important;
        --ion-color-base-rgb: var(--ion-color-primary-rgb, var(--ion-color-primary-bold-rgb)) !important;
        --ion-color-contrast: var(--ion-color-primary-contrast, var(--ion-color-primary-bold-contrast)) !important;
        --ion-color-contrast-rgb: var(--ion-color-primary-contrast-rgb, var(--ion-color-primary-bold-contrast-rgb)) !important;
        --ion-color-shade: var(--ion-color-primary-shade, var(--ion-color-primary-bold-shade)) !important;
        --ion-color-tint: var(--ion-color-primary-tint, var(--ion-color-primary-bold-tint)) !important;
        --ion-color-foreground: var(--ion-color-primary-foreground, var(--ion-color-primary-bold-foreground)) !important;

        --ion-color-subtle-base: var(--ion-color-primary-subtle) !important;
        --ion-color-subtle-base-rgb: var(--ion-color-primary-subtle-rgb) !important;
        --ion-color-subtle-contrast: var(--ion-color-primary-subtle-contrast) !important;
        --ion-color-subtle-contrast-rgb: var(--ion-color-primary-subtle-contrast-rgb) !important;
        --ion-color-subtle-shade: var(--ion-color-primary-subtle-shade) !important;
        --ion-color-subtle-tint: var(--ion-color-primary-subtle-tint) !important;
        --ion-color-subtle-foreground: var(--ion-color-primary-subtle-foreground) !important;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should not include component or palette variables in global CSS', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'never',
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      components: {
        IonChip: {
          hue: {
            subtle: {
              bg: 'red',
            },
          },
          shape: {
            round: {
              borderRadius: '4px',
            },
          },
        },
        IonButton: {
          color: {
            primary: {
              bg: 'blue',
            },
          },
        },
      },
    };

    const css = generateGlobalThemeCSS(theme);

    // Should include global design tokens
    expect(css).toContain('--ion-border-width-sm: 4px');
    expect(css).toContain('--ion-spacing-md: 12px');

    // Should NOT include component variables
    expect(css).not.toContain('--ion-components-ion-chip-hue-subtle-bg');
    expect(css).not.toContain('--ion-components-ion-chip-shape-round-border-radius');
    expect(css).not.toContain('--ion-components-ion-button-color-primary-bg');
    expect(css).not.toContain('components');

    // Should NOT include palette variables
    expect(css).not.toContain('--ion-color-palette-dark-enabled-never');
    expect(css).not.toContain('palette');
  });

  it('should generate global CSS for a given theme with dark palette enabled for system preference', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'system',
          color: {
            primary: {
              bold: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
              subtle: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
            },
            red: {
              50: '#ffebee',
              100: '#ffcdd2',
              200: '#ef9a9a',
            },
          },
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      dynamicFont: '-apple-system-body',
    };

    const css = generateGlobalThemeCSS(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root {
        --ion-border-width-sm: 4px;
        --ion-spacing-md: 12px;
        --ion-dynamic-font: -apple-system-body;
      }

      @media(prefers-color-scheme: dark) {
        :root {
          --ion-color-primary-bold: #0054e9;
          --ion-color-primary-bold-rgb: 0, 84, 233;
          --ion-color-primary-bold-contrast: #ffffff;
          --ion-color-primary-bold-contrast-rgb: 255, 255, 255;
          --ion-color-primary-bold-shade: #0041c4;
          --ion-color-primary-bold-tint: #0065ff;
          --ion-color-primary-subtle: #0054e9;
          --ion-color-primary-subtle-rgb: 0, 84, 233;
          --ion-color-primary-subtle-contrast: #ffffff;
          --ion-color-primary-subtle-contrast-rgb: 255, 255, 255;
          --ion-color-primary-subtle-shade: #0041c4;
          --ion-color-primary-subtle-tint: #0065ff;
          --ion-color-red-50: #ffebee;
          --ion-color-red-100: #ffcdd2;
          --ion-color-red-200: #ef9a9a;
        }
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should generate global CSS for a given theme with high contrast palette enabled for system preference', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'never',
        },
        highContrast: {
          enabled: 'system',
          color: {
            primary: {
              bold: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
              subtle: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
            },
            red: {
              50: '#ffebee',
              100: '#ffcdd2',
              200: '#ef9a9a',
            },
          },
        },
        highContrastDark: {
          enabled: 'never',
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      dynamicFont: '-apple-system-body',
    };

    const css = generateGlobalThemeCSS(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root {
        --ion-border-width-sm: 4px;
        --ion-spacing-md: 12px;
        --ion-dynamic-font: -apple-system-body;
      }

      @media(prefers-contrast: more) {
        :root {
          --ion-color-primary-bold: #0054e9;
          --ion-color-primary-bold-rgb: 0, 84, 233;
          --ion-color-primary-bold-contrast: #ffffff;
          --ion-color-primary-bold-contrast-rgb: 255, 255, 255;
          --ion-color-primary-bold-shade: #0041c4;
          --ion-color-primary-bold-tint: #0065ff;
          --ion-color-primary-subtle: #0054e9;
          --ion-color-primary-subtle-rgb: 0, 84, 233;
          --ion-color-primary-subtle-contrast: #ffffff;
          --ion-color-primary-subtle-contrast-rgb: 255, 255, 255;
          --ion-color-primary-subtle-shade: #0041c4;
          --ion-color-primary-subtle-tint: #0065ff;
          --ion-color-red-50: #ffebee;
          --ion-color-red-100: #ffcdd2;
          --ion-color-red-200: #ef9a9a;
        }
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should generate global CSS for a given theme with high contrast dark palette enabled for system preference', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {},
        dark: {
          enabled: 'never',
        },
        highContrast: {
          enabled: 'never',
        },
        highContrastDark: {
          enabled: 'system',
          color: {
            primary: {
              bold: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
              subtle: {
                base: '#0054e9',
                contrast: '#ffffff',
                shade: '#0041c4',
                tint: '#0065ff',
              },
            },
            red: {
              50: '#ffebee',
              100: '#ffcdd2',
              200: '#ef9a9a',
            },
          },
        },
      },
      borderWidth: {
        sm: '4px',
      },
      spacing: {
        md: '12px',
      },
      dynamicFont: '-apple-system-body',
    };

    const css = generateGlobalThemeCSS(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root {
        --ion-border-width-sm: 4px;
        --ion-spacing-md: 12px;
        --ion-dynamic-font: -apple-system-body;
      }

      @media(prefers-contrast: more) and (prefers-color-scheme: dark) {
        :root {
          --ion-color-primary-bold: #0054e9;
          --ion-color-primary-bold-rgb: 0, 84, 233;
          --ion-color-primary-bold-contrast: #ffffff;
          --ion-color-primary-bold-contrast-rgb: 255, 255, 255;
          --ion-color-primary-bold-shade: #0041c4;
          --ion-color-primary-bold-tint: #0065ff;
          --ion-color-primary-subtle: #0054e9;
          --ion-color-primary-subtle-rgb: 0, 84, 233;
          --ion-color-primary-subtle-contrast: #ffffff;
          --ion-color-primary-subtle-contrast-rgb: 255, 255, 255;
          --ion-color-primary-subtle-shade: #0041c4;
          --ion-color-primary-subtle-tint: #0065ff;
          --ion-color-red-50: #ffebee;
          --ion-color-red-100: #ffcdd2;
          --ion-color-red-200: #ef9a9a;
        }
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });
});

describe('generateComponentsThemeCSS', () => {
  it('should generate component theme CSS for a given theme with a single component', () => {
    const components = {
      IonChip: {
        hue: {
          subtle: {
            bg: 'red',
            color: 'white',
            borderColor: 'black',
          },
          bold: {
            bg: 'blue',
            color: 'white',
            borderColor: 'black',
          },
        },
      },
    };

    const css = generateComponentsThemeCSS(components).replace(/\s/g, '');

    const expectedCSS = `
      ion-chip {
        --ion-chip-hue-subtle-bg: red;
        --ion-chip-hue-subtle-color: white;
        --ion-chip-hue-subtle-border-color: black;
        --ion-chip-hue-bold-bg: blue;
        --ion-chip-hue-bold-color: white;
        --ion-chip-hue-bold-border-color: black;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should generate component theme CSS for a given theme with multiple components', () => {
    const components = {
      IonChip: {
        hue: {
          subtle: {
            bg: 'red',
            color: 'white',
            borderColor: 'black',
          },
          bold: {
            bg: 'blue',
            color: 'white',
            borderColor: 'black',
          },
        },
      },
      IonBadge: {
        hue: {
          subtle: {
            bg: 'green',
            color: 'white',
            borderColor: 'black',
          },
          bold: {
            bg: 'blue',
            color: 'white',
            borderColor: 'black',
          },
        },
      },
    };

    const css = generateComponentsThemeCSS(components).replace(/\s/g, '');

    const expectedCSS = `
      ion-chip {
        --ion-chip-hue-subtle-bg: red;
        --ion-chip-hue-subtle-color: white;
        --ion-chip-hue-subtle-border-color: black;
        --ion-chip-hue-bold-bg: blue;
        --ion-chip-hue-bold-color: white;
        --ion-chip-hue-bold-border-color: black;
      }

      ion-badge {
        --ion-badge-hue-subtle-bg: green;
        --ion-badge-hue-subtle-color: white;
        --ion-badge-hue-subtle-border-color: black;
        --ion-badge-hue-bold-bg: blue;
        --ion-badge-hue-bold-color: white;
        --ion-badge-hue-bold-border-color: black;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should not generate CSS variables for an empty components object', () => {
    const components = {};

    const css = generateComponentsThemeCSS(components);

    expect(css).toBe('');
  });
});

describe('generateColorClasses', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn');
    // Suppress console.warn output from polluting the test output
    consoleWarnSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should generate color classes for a given theme', () => {
    const theme = {
      name: 'test',
      palette: {
        light: {
          color: {
            primary: {
              bold: {
                base: '#0054e9',
                contrast: '#ffffff',
                foreground: '#000000',
                shade: '#0041c4',
                tint: '#0065ff',
              },
              subtle: {
                base: '#0054e9',
                contrast: '#ffffff',
                foreground: '#000000',
                shade: '#0041c4',
                tint: '#0065ff',
              },
            },
          },
        },
      },
    };

    const css = generateColorClasses(theme).replace(/\s/g, '');

    const expectedCSS = `
      :root .ion-color-primary {
        --ion-color-base: var(--ion-color-primary, var(--ion-color-primary-bold)) !important;
        --ion-color-base-rgb: var(--ion-color-primary-rgb, var(--ion-color-primary-bold-rgb)) !important;
        --ion-color-contrast: var(--ion-color-primary-contrast, var(--ion-color-primary-bold-contrast)) !important;
        --ion-color-contrast-rgb: var(--ion-color-primary-contrast-rgb, var(--ion-color-primary-bold-contrast-rgb)) !important;
        --ion-color-shade: var(--ion-color-primary-shade, var(--ion-color-primary-bold-shade)) !important;
        --ion-color-tint: var(--ion-color-primary-tint, var(--ion-color-primary-bold-tint)) !important;
        --ion-color-foreground: var(--ion-color-primary-foreground, var(--ion-color-primary-bold-foreground)) !important;

        --ion-color-subtle-base: var(--ion-color-primary-subtle) !important;
        --ion-color-subtle-base-rgb: var(--ion-color-primary-subtle-rgb) !important;
        --ion-color-subtle-contrast: var(--ion-color-primary-subtle-contrast) !important;
        --ion-color-subtle-contrast-rgb: var(--ion-color-primary-subtle-contrast-rgb) !important;
        --ion-color-subtle-shade: var(--ion-color-primary-subtle-shade) !important;
        --ion-color-subtle-tint: var(--ion-color-primary-subtle-tint) !important;
        --ion-color-subtle-foreground: var(--ion-color-primary-subtle-foreground) !important;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should not generate color classes for a given theme without colors', () => {
    const theme = {
      spacing: {
        xs: '12px',
        sm: '12px',
        md: '12px',
        lg: '12px',
        xl: '12px',
        xxl: '12px',
      },
    };

    const css = generateColorClasses(theme).replace(/\s/g, '');

    expect(css).toBe('');
  });

  it('should not generate color classes for a given theme with an invalid string color value', () => {
    const theme = {
      spacing: {
        xs: '12px',
        sm: '12px',
        md: '12px',
        lg: '12px',
        xl: '12px',
        xxl: '12px',
      },
      color: 'red',
    };

    const css = generateColorClasses(theme).replace(/\s/g, '');

    // Only check the first log to get the string message
    expect(consoleWarnSpy.mock.calls[0][0]).toContain(
      '[Ionic Warning]: Invalid color configuration in theme. Expected color to be an object, but found string.'
    );

    expect(css).toBe('');
  });

  it('should not generate color classes for a given theme with an invalid array color value', () => {
    const theme = {
      spacing: {
        xs: '12px',
        sm: '12px',
        md: '12px',
        lg: '12px',
        xl: '12px',
        xxl: '12px',
      },
      color: ['red', 'blue', 'yellow'],
    };

    const css = generateColorClasses(theme).replace(/\s/g, '');

    // Only check the first log to get the string message
    expect(consoleWarnSpy.mock.calls[0][0]).toContain(
      '[Ionic Warning]: Invalid color configuration in theme. Expected color to be an object, but found array.'
    );

    expect(css).toBe('');
  });
});

describe('hexToRgb()', () => {
  it('should convert 6-digit hex colors to RGB strings', () => {
    expect(hexToRgb('#ffffff')).toBe('255, 255, 255');
    expect(hexToRgb('#000000')).toBe('0, 0, 0');
    expect(hexToRgb('#ff0000')).toBe('255, 0, 0');
    expect(hexToRgb('#00ff00')).toBe('0, 255, 0');
    expect(hexToRgb('#0000ff')).toBe('0, 0, 255');
    expect(hexToRgb('#3880ff')).toBe('56, 128, 255');
  });

  it('should convert 3-digit hex colors to RGB strings', () => {
    expect(hexToRgb('#fff')).toBe('255, 255, 255');
    expect(hexToRgb('#000')).toBe('0, 0, 0');
    expect(hexToRgb('#f00')).toBe('255, 0, 0');
    expect(hexToRgb('#0f0')).toBe('0, 255, 0');
    expect(hexToRgb('#00f')).toBe('0, 0, 255');
    expect(hexToRgb('#abc')).toBe('170, 187, 204');
  });

  it('should handle hex colors without hash prefix', () => {
    expect(hexToRgb('ffffff')).toBe('255, 255, 255');
    expect(hexToRgb('fff')).toBe('255, 255, 255');
    expect(hexToRgb('3880ff')).toBe('56, 128, 255');
  });
});

describe('mix()', () => {
  it('should mix two hex colors by weight percentage', () => {
    // Mix white into black
    expect(mix('#000000', '#ffffff', '0%')).toBe('#000000');
    expect(mix('#000000', '#ffffff', '50%')).toBe('#808080');
    expect(mix('#000000', '#ffffff', '100%')).toBe('#ffffff');
  });

  it('should mix colors with different percentages', () => {
    // Mix red into blue
    expect(mix('#0000ff', '#ff0000', '25%')).toBe('#4000bf');
    expect(mix('#0000ff', '#ff0000', '75%')).toBe('#bf0040');
  });

  it('should handle 3-digit hex colors', () => {
    expect(mix('#000', '#fff', '50%')).toBe('#808080');
    expect(mix('#f00', '#0f0', '50%')).toBe('#808000');

    // 3-digit + 6-digit
    expect(mix('#000', '#ffffff', '50%')).toBe('#808080');
    expect(mix('#000000', '#fff', '50%')).toBe('#808080');
  });

  it('should handle hex colors without hash prefix', () => {
    expect(mix('000000', 'ffffff', '50%')).toBe('#808080');
    expect(mix('f00', '0f0', '50%')).toBe('#808000');

    // With and without hash prefix
    expect(mix('#000000', 'ffffff', '50%')).toBe('#808080');
    expect(mix('f00', '#0f0', '50%')).toBe('#808000');
  });

  it('should handle fractional percentages', () => {
    expect(mix('#000000', '#ffffff', '12.5%')).toBe('#202020');
    expect(mix('#ffffff', '#000000', '87.5%')).toBe('#202020');
  });

  it('should work with real-world color examples', () => {
    // Mix primary Ionic blue with white
    expect(mix('#3880ff', '#ffffff', '10%')).toBe('#4c8dff');

    // Mix primary Ionic blue with black for shade
    expect(mix('#3880ff', '#000000', '12%')).toBe('#3171e0');
  });

  it('should handle edge cases', () => {
    // Same colors should return base color regardless of weight
    expect(mix('#ff0000', '#ff0000', '50%')).toBe('#ff0000');

    // Zero weight should return base color
    expect(mix('#123456', '#abcdef', '0%')).toBe('#123456');

    // 100% weight should return mix color
    expect(mix('#123456', '#abcdef', '100%')).toBe('#abcdef');
  });
});
