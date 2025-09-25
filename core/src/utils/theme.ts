import type { Color, CssClassMap } from '../interface';

import { deepMerge } from './helpers';

export const CSS_PROPS_PREFIX = '--ion-';
export const CSS_ROOT_SELECTOR = ':root';

export const hostContext = (selector: string, el: HTMLElement): boolean => {
  return el.closest(selector) !== null;
};

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export const createColorClasses = (color: Color | undefined | null, cssClassMap: CssClassMap): CssClassMap => {
  return typeof color === 'string' && color.length > 0
    ? {
        'ion-color': true,
        [`ion-color-${color}`]: true,
        ...cssClassMap,
      }
    : cssClassMap;
};

export const getClassList = (classes: string | (string | null | undefined)[] | undefined): string[] => {
  if (classes !== undefined) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter((c) => c != null)
      .map((c) => (c as string).trim())
      .filter((c) => c !== '');
  }
  return [];
};

export const getClassMap = (classes: string | string[] | undefined): CssClassMap => {
  const map: CssClassMap = {};
  getClassList(classes).forEach((c) => (map[c] = true));
  return map;
};

/**
 * Gets and merges custom themes based on mode
 * @param customTheme The custom theme
 * @param mode The current mode (ios | md)
 * @returns The merged custom theme
 */
export const getCustomTheme = (customTheme: any, mode: string): any => {
  if (!customTheme) return undefined;

  // Check if the custom theme contains mode overrides (ios | md)
  if (customTheme.ios || customTheme.md) {
    const { ios, md, ...baseCustomTheme } = customTheme;

    // Flatten the mode-specific overrides based on current mode
    if (mode === 'ios' && ios) {
      return deepMerge(baseCustomTheme, ios);
    } else if (mode === 'md' && md) {
      return deepMerge(baseCustomTheme, md);
    }

    return baseCustomTheme;
  }

  return customTheme;
};

/**
 * Flattens the theme object into CSS custom properties
 * @param theme The theme object to flatten
 * @param prefix The CSS prefix to use (e.g., '--ion-')
 * @returns CSS string with custom properties
 */
export const generateCSSVars = (theme: any, prefix: string = CSS_PROPS_PREFIX): string => {
  const cssProps = Object.entries(theme)
    .flatMap(([key, val]) => {
      // Skip invalid keys or values
      if (!key || typeof key !== 'string' || val === null || val === undefined) {
        return [];
      }

      // if key is camelCase, convert to kebab-case
      if (key.match(/([a-z])([A-Z])/g)) {
        key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      }

      // Special handling for 'base' property - don't add suffix
      if (key === 'base') {
        return [`${prefix.slice(0, -1)}: ${val};`];
      }

      // Generate rgb variables for base and contrast color variants
      // These are only generated when processing global color objects,
      // not component-level color overrides
      // TODO(): this only works with hex values
      if ((key === 'bold' || key === 'subtle') && prefix.includes('color')) {
        if (typeof val === 'object' && val !== null) {
          return Object.entries(val).flatMap(([property, hexValue]) => {
            if (typeof hexValue === 'string' && hexValue.startsWith('#')) {
              // For 'base' property, don't include the property name in the CSS variable
              const varName = property === 'base' ? `${prefix}${key}` : `${prefix}${key}-${property}`;
              const cssVars = [`${varName}: ${hexValue};`];

              // Only add RGB values for base and contrast
              if (property === 'base' || property === 'contrast') {
                const rgbVarName = property === 'base' ? `${prefix}${key}-rgb` : `${prefix}${key}-${property}-rgb`;
                cssVars.push(`${rgbVarName}: ${hexToRgb(hexValue)};`);
              }

              return cssVars;
            }
            return [];
          });
        }
      }

      // If it's a font-sizes key, create rem version
      // This is necessary to support the dynamic font size feature
      if (key === 'font-sizes' && typeof val === 'object' && val !== null) {
        // Access the root font size from the global theme context
        const fontSizeBase = parseFloat((window as any).Ionic?.config?.get?.('theme')?.fontSizes?.root ?? '16');
        return Object.entries(val).flatMap(([sizeKey, sizeValue]) => {
          if (!sizeKey || sizeValue == null) return [];
          const remValue = `${parseFloat(sizeValue) / fontSizeBase}rem`;
          // Return both px and rem values as separate array items
          return [
            `${prefix}${key}-${sizeKey}: ${sizeValue};`, // original px value
            `${prefix}${key}-${sizeKey}-rem: ${remValue};`, // rem value
          ];
        });
      }

      return typeof val === 'object' && val !== null
        ? generateCSSVars(val, `${prefix}${key}-`)
        : [`${prefix}${key}: ${val};`];
    })
    .filter(Boolean);

  return cssProps.join('\n');
};

/**
 * Generates a CSS class containing the CSS variables for each color
 * in the theme. Each color has generic bold and subtle variables that are mapped
 * to the specific color's bold and subtle variables. The bold colors will temporarily
 * include a fallback to remove the bold prefix. For example, the primary
 * color will return the following CSS class:
 *
 * ```css
 * :root .ion-color-primary {
 *   --ion-color-base: var(--ion-color-primary, var(--ion-color-primary-bold));
 *   --ion-color-base-rgb: var(--ion-color-primary-rgb, var(--ion-color-primary-bold-rgb));
 *   --ion-color-contrast: var(--ion-color-primary-contrast, var(--ion-color-primary-bold-contrast));
 *   --ion-color-contrast-rgb: var(--ion-color-primary-contrast-rgb, var(--ion-color-primary-bold-contrast-rgb));
 *   --ion-color-shade: var(--ion-color-primary-shade, var(--ion-color-primary-bold-shade));
 *   --ion-color-tint: var(--ion-color-primary-tint, var(--ion-color-primary-bold-tint));
 *   --ion-color-foreground: var(--ion-color-primary, var(--ion-color-primary-foreground, var(--ion-color-primary-bold-foreground)));
 *
 *   --ion-color-subtle-base: var(--ion-color-primary-subtle);
 *   --ion-color-subtle-base-rgb: var(--ion-color-primary-subtle-rgb);
 *   --ion-color-subtle-contrast: var(--ion-color-primary-subtle-contrast);
 *   --ion-color-subtle-contrast-rgb: var(--ion-color-primary-subtle-contrast-rgb);
 *   --ion-color-subtle-shade: var(--ion-color-primary-subtle-shade);
 *   --ion-color-subtle-tint: var(--ion-color-primary-subtle-tint);
 *   --ion-color-subtle-foreground: var(--ion-color-primary-subtle-foreground);
 * }
 * ```
 *
 * @param theme The theme object containing color definitions
 * @returns CSS string with .ion-color-{colorName} utility classes
 */
export const generateColorClasses = (theme: any): string => {
  // Look for colors in the light palette first, then fallback to the
  // direct color property if there is no light palette
  const colors = theme?.palette?.light?.color || theme?.color;

  if (!colors || typeof colors !== 'object') {
    return '';
  }

  const generatedColorClasses: string[] = [];

  Object.keys(colors).forEach((colorName) => {
    const colorVariants = colors[colorName];
    if (!colorVariants || typeof colorVariants !== 'object') return;

    const cssVariableRules: string[] = [];

    // Generate CSS variables for bold variant
    // Includes base color variables without the bold modifier for
    // backwards compatibility.
    // TODO: Remove the fallbacks once the bold variables are the default
    if (colorVariants.bold) {
      cssVariableRules.push(
        `--ion-color-base: var(--ion-color-${colorName}, var(--ion-color-${colorName}-bold)) !important;`,
        `--ion-color-base-rgb: var(--ion-color-${colorName}-rgb, var(--ion-color-${colorName}-bold-rgb)) !important;`,
        `--ion-color-contrast: var(--ion-color-${colorName}-contrast, var(--ion-color-${colorName}-bold-contrast)) !important;`,
        `--ion-color-contrast-rgb: var(--ion-color-${colorName}-contrast-rgb, var(--ion-color-${colorName}-bold-contrast-rgb)) !important;`,
        `--ion-color-shade: var(--ion-color-${colorName}-shade, var(--ion-color-${colorName}-bold-shade)) !important;`,
        `--ion-color-tint: var(--ion-color-${colorName}-tint, var(--ion-color-${colorName}-bold-tint)) !important;`,
        `--ion-color-foreground: var(--ion-color-${colorName}-foreground, var(--ion-color-${colorName}-bold-foreground)) !important;`
      );
    }

    // Generate CSS variables for subtle variant
    if (colorVariants.subtle) {
      cssVariableRules.push(
        `--ion-color-subtle-base: var(--ion-color-${colorName}-subtle) !important;`,
        `--ion-color-subtle-base-rgb: var(--ion-color-${colorName}-subtle-rgb) !important;`,
        `--ion-color-subtle-contrast: var(--ion-color-${colorName}-subtle-contrast) !important;`,
        `--ion-color-subtle-contrast-rgb: var(--ion-color-${colorName}-subtle-contrast-rgb) !important;`,
        `--ion-color-subtle-shade: var(--ion-color-${colorName}-subtle-shade) !important;`,
        `--ion-color-subtle-tint: var(--ion-color-${colorName}-subtle-tint) !important;`,
        `--ion-color-subtle-foreground: var(--ion-color-${colorName}-subtle-foreground) !important;`
      );
    }

    if (cssVariableRules.length > 0) {
      const colorUtilityClass = `
        :root .ion-color-${colorName} {
          ${cssVariableRules.join('\n  ')}
        }
      `;

      generatedColorClasses.push(colorUtilityClass);
    }
  });

  return generatedColorClasses.join('\n');
};

/**
 * Creates a style element and injects its CSS into a target element
 * @param css The CSS string to inject
 * @param target The target element to inject into
 */
export const injectCSS = (css: string, target: Element | ShadowRoot = document.head) => {
  const style = document.createElement('style');
  style.innerHTML = css;
  target.appendChild(style);
};

/**
 * Generates global CSS variables from a theme object
 * @param theme The theme object to generate CSS for
 * @returns The generated CSS string
 */
export const generateGlobalThemeCSS = (theme: any): string => {
  if (typeof theme !== 'object' || Array.isArray(theme)) {
    console.warn('generateGlobalThemeCSS: Invalid theme object provided', theme);
    return '';
  }

  if (Object.keys(theme).length === 0) {
    console.warn('generateGlobalThemeCSS: Empty theme object provided');
    return '';
  }

  // Exclude components and palette from the default tokens
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { palette, components, ...defaultTokens } = theme;

  // Generate CSS variables for the default design tokens
  const defaultTokensCSS = generateCSSVars(defaultTokens);

  // Generate CSS variables for the light color palette
  const lightTokensCSS = generateCSSVars(palette.light);

  // Generate CSS variables for the dark color palette
  const darkTokensCSS = generateCSSVars(palette.dark);

  // Include CSS variables for the dark color palette instead of
  // the light palette if dark palette enabled is 'always'
  const paletteTokensCSS = palette.dark.enabled === 'always' ? darkTokensCSS : lightTokensCSS;

  let css = `
    ${CSS_ROOT_SELECTOR} {
      ${defaultTokensCSS}
      ${paletteTokensCSS}
    }
  `;

  // Include CSS variables for the dark color palette inside of a
  // class if dark palette enabled is 'class'
  if (palette.dark.enabled === 'class') {
    css += `
      .ion-palette-dark {
        ${darkTokensCSS}
      }
    `;
  }

  // Include CSS variables for the dark color palette inside of the
  // dark color scheme media query if dark palette enabled is 'system'
  if (palette.dark.enabled === 'system') {
    css += `
      @media (prefers-color-scheme: dark) {
        ${CSS_ROOT_SELECTOR} {
          ${darkTokensCSS}
        }
      }
    `;
  }

  // Add color classes
  const colorClasses = generateColorClasses(theme);

  return css + '\n' + colorClasses;
};

/**
 * Applies the global theme from the provided base theme and user theme
 * @param baseTheme The default theme
 * @param userTheme The user's custom theme (optional)
 * @returns The combined theme object (or base theme if no user theme was provided)
 */
export const applyGlobalTheme = (baseTheme: any, userTheme?: any): any => {
  // If no base theme provided, error
  if (typeof baseTheme !== 'object' || Array.isArray(baseTheme)) {
    console.error('applyGlobalTheme: Valid base theme object is required', baseTheme);
    return {};
  }

  // If no user theme provided or it is invalid, apply base theme
  if (!userTheme || typeof userTheme !== 'object' || Array.isArray(userTheme)) {
    if (userTheme) {
      console.error('applyGlobalTheme: Invalid user theme provided', userTheme);
    }
    injectCSS(generateGlobalThemeCSS(baseTheme));
    return baseTheme;
  }

  // Merge themes and apply
  const mergedTheme = deepMerge(baseTheme, userTheme);
  injectCSS(generateGlobalThemeCSS(mergedTheme));
  return mergedTheme;
};

/**
 * Generates component's themed CSS class with CSS variables
 * from its theme object
 * @param componentTheme The component's object to generate CSS for (e.g., IonChip { })
 * @param componentName The component name without any prefixes (e.g., 'chip')
 * @returns string containing the component's themed CSS variables
 */
export const generateComponentThemeCSS = (componentTheme: any, componentName: string): string => {
  const cssProps = generateCSSVars(componentTheme, `${CSS_PROPS_PREFIX}${componentName}-`);

  return `
    :host(.${componentName}-themed) {
      ${cssProps}
    }
  `;
};

/**
 * Applies a component theme to an element if it exists in the custom theme
 * @param element The element to apply the theme to
 * @returns true if theme was applied, false otherwise
 */
export const applyComponentTheme = (element: HTMLElement): void => {
  const customTheme = (window as any).Ionic?.config?.get?.('customTheme');

  // Convert 'ION-CHIP' to 'ion-chip' and split into parts
  const parts = element.tagName.toLowerCase().split('-');

  // Get the component name 'chip' from the second part
  const componentName = parts[1];

  // Convert to 'IonChip' by capitalizing each part
  const themeLookupName = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

  // Get the component theme from the global custom theme if it exists
  const componentTheme = customTheme?.components?.[themeLookupName];

  if (componentTheme) {
    // Add the theme class to the element (e.g., 'chip-themed')
    const themeClass = `${componentName}-themed`;
    element.classList.add(themeClass);

    // Generate CSS custom properties inside a theme class selector
    const css = generateComponentThemeCSS(componentTheme, componentName);

    // Inject styles into shadow root if available,
    // otherwise into the element itself
    const root = element.shadowRoot ?? element;
    injectCSS(css, root);
  }
};

/**
 * Converts a hex color to RGB comma-separated values
 * @param hex Hex color (e.g., '#ffffff' or '#fff')
 * @returns RGB string (e.g., '255, 255, 255')
 */
export const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // Short hex format like 'fff' → expand to 'ffffff'
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    // Full hex format like 'ffffff'
    r = parseInt(cleanHex.substr(0, 2), 16);
    g = parseInt(cleanHex.substr(2, 2), 16);
    b = parseInt(cleanHex.substr(4, 2), 16);
  }

  return `${r}, ${g}, ${b}`;
};

/**
 * Mixes two hex colors by a given weight percentage
 * @param baseColor Base color (e.g., '#0054e9')
 * @param mixColor Color to mix in (e.g., '#000000' or '#fff')
 * @param weight Weight percentage as string - how much of mixColor to mix into baseColor (e.g., '12%')
 * @returns Mixed hex color
 */
export const mix = (baseColor: string, mixColor: string, weight: string): string => {
  // Parse weight percentage
  const w = parseFloat(weight.replace('%', '')) / 100;

  // Parse hex colors
  const parseHex = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace('#', '');

    // Short hex format like 'fff' → expand to 'ffffff'
    if (cleanHex.length === 3) {
      return [
        parseInt(cleanHex[0] + cleanHex[0], 16),
        parseInt(cleanHex[1] + cleanHex[1], 16),
        parseInt(cleanHex[2] + cleanHex[2], 16),
      ];
      // Full hex format like 'ffffff'
    } else {
      return [
        parseInt(cleanHex.substr(0, 2), 16),
        parseInt(cleanHex.substr(2, 2), 16),
        parseInt(cleanHex.substr(4, 2), 16),
      ];
    }
  };

  // Parse both colors
  const [baseR, baseG, baseB] = parseHex(baseColor);
  const [mixR, mixG, mixB] = parseHex(mixColor);

  // Mix mixColor into baseColor by weight
  const r = Math.round(baseR * (1 - w) + mixR * w);
  const g = Math.round(baseG * (1 - w) + mixG * w);
  const b = Math.round(baseB * (1 - w) + mixB * w);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
