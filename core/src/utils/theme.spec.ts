import { newSpecPage } from '@stencil/core/testing';

import { CardContent } from '../components/card-content/card-content';
import { Chip } from '../components/chip/chip';

import { generateComponentThemeCSS, generateCSSVars, generateGlobalThemeCSS, injectCSS } from './theme';

describe('generateCSSVars', () => {
  it('should not generate CSS variables for an empty theme', () => {
    const theme = {
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
      palette: {
        light: {},
        dark: {
          enabled: 'system',
        },
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

    const css = generateCSSVars(theme);

    expect(css).toContain('--ion-palette-dark-enabled: system;');
    expect(css).toContain('--ion-border-width-sm: 4px;');
    expect(css).toContain('--ion-spacing-md: 12px;');
    expect(css).toContain('--ion-scaling-0: 0;');
    expect(css).toContain('--ion-radii-lg: 8px;');
    expect(css).toContain('--ion-dynamic-font: -apple-system-body;');
    expect(css).toContain('--ion-font-family: Roboto, "Helvetica Neue", sans-serif;');
    expect(css).toContain('--ion-font-weights-semi-bold: 600;');
    expect(css).toContain('--ion-font-sizes-sm: 14px;');
    expect(css).toContain('--ion-font-sizes-sm-rem: 0.875rem;');
    expect(css).toContain('--ion-font-sizes-md: 16px;');
    expect(css).toContain('--ion-font-sizes-md-rem: 1rem;');
    expect(css).toContain('--ion-line-heights-sm: 1.2;');
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
});

describe('generateGlobalThemeCSS', () => {
  it('should generate global CSS for a given theme', () => {
    const theme = {
      palette: {
        light: {},
        dark: {
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
        --ion-color-primary-bold-contrast: #ffffff;
        --ion-color-primary-bold-shade: #0041c4;
        --ion-color-primary-bold-tint: #0065ff;
        --ion-color-primary-subtle: #0054e9;
        --ion-color-primary-subtle-contrast: #ffffff;
        --ion-color-primary-subtle-shade: #0041c4;
        --ion-color-primary-subtle-tint: #0065ff;
        --ion-color-red-50: #ffebee;
        --ion-color-red-100: #ffcdd2;
        --ion-color-red-200: #ef9a9a;
      }
    `.replace(/\s/g, '');

    expect(css).toBe(expectedCSS);
  });

  it('should not include component or palette variables in global CSS', () => {
    const theme = {
      palette: {
        light: {},
        dark: {
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
          --ion-enabled: system;
          --ion-color-primary-bold: #0054e9;
          --ion-color-primary-bold-contrast: #ffffff;
          --ion-color-primary-bold-shade: #0041c4;
          --ion-color-primary-bold-tint: #0065ff;
          --ion-color-primary-subtle: #0054e9;
          --ion-color-primary-subtle-contrast: #ffffff;
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

describe('generateComponentThemeCSS', () => {
  it('should generate component theme CSS for a given theme', () => {
    const IonChip = {
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
    };

    const css = generateComponentThemeCSS(IonChip, 'chip').replace(/\s/g, '');

    const expectedCSS = `
      :host(.chip-themed) {
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
});
