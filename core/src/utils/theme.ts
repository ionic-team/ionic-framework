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

  const { palette, ...defaultTokens } = theme;

  // Generate CSS variables for the default design tokens
  const defaultTokensCSS = generateCSSVars(defaultTokens);

  // Generate CSS variables for the light color palette
  const lightTokensCSS = generateCSSVars(palette.light);

  let css = `
    ${CSS_ROOT_SELECTOR} {
      ${defaultTokensCSS}
      ${lightTokensCSS}
    }
  `;

  // Generate CSS variables for the dark color palette if it
  // is enabled for system preference
  if (palette.dark.enabled === 'system') {
    const darkTokensCSS = generateCSSVars(palette.dark);
    if (darkTokensCSS.length > 0) {
      css += `
        @media (prefers-color-scheme: dark) {
          ${CSS_ROOT_SELECTOR} {
            ${darkTokensCSS}
          }
        }
      `;
    }
  }

  return css;
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

  // Remove 'ion-' prefix to get 'chip'
  const componentName = parts.slice(1).join('-');

  // Convert to 'IonChip' by capitalizing each part
  const themeLookupName = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

  if (customTheme?.components?.[themeLookupName]) {
    const componentTheme = customTheme.components[themeLookupName];

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
