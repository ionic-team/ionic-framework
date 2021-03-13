export const dashToPascalCase = (str: string) =>
  str
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
export const camelToDashCase = (str: string) =>
  str.replace(/([A-Z])/g, (m: string) => `-${m[0].toLowerCase()}`);
