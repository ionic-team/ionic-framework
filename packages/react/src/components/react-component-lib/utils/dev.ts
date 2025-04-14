export const isDevMode = () => {
  return process && process.env && process.env.NODE_ENV === 'development';
};

const warnings: { [key: string]: boolean } = {};

export const deprecationWarning = (key: string, message: string) => {
  if (isDevMode()) {
    if (!warnings[key]) {
      console.warn(message);
      warnings[key] = true;
    }
  }
};
