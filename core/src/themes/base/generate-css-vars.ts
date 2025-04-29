// import type { Theme } from './base.tokens';

export function generateCSSVars(theme: any, themePrefix = '--ion-', selector = ':root'): string {
  const flatten = (obj: any, prefix = themePrefix): string =>
    Object.entries(obj)
      .flatMap(([key, val]) => {
        // if key is camelCase, convert to kebab-case
        if (key.match(/([a-z])([A-Z])/g)) {
          key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }

        // If it's a font-sizes key, create rem version
        // This is necessary to support the dynamic font size feature
        if (key === 'font-sizes' && typeof val === 'object' && val !== null) {
          const fontSizeBase = parseFloat(theme.fontSizes.root);
          return Object.entries(val).map(([sizeKey, sizeValue]) => {
            const remValue = `${parseFloat(sizeValue) / fontSizeBase}rem`;
            // Need a check to determine if the value is already in rem
            return [
              `${prefix}${key}-${sizeKey}: ${sizeValue};`, // original px value
              `${prefix}${key}-${sizeKey}-rem: ${remValue};` // rem value
            ].join('\n');
          }).join('\n');
        }

        return typeof val === 'object' && val !== null
          ? flatten(val, `${prefix}${key}-`)
          : [`${prefix}${key}: ${val};`];
      })
      .join('\n');

  return `${selector} {\n${flatten(theme)}\n}`;
}

// Simple deep merge function
export function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
