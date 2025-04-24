// import type { Theme } from './base.tokens';

export function generateCSSVars(theme: any, themePrefix = '--ion-', selector = ':root'): string {
  const flatten = (obj: any, prefix = themePrefix): string =>
    Object.entries(obj)
      .flatMap(([key, val]) => {
        // if key is camelCase, convert to kebab-case
        if (key.match(/([a-z])([A-Z])/g)) {
          key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
