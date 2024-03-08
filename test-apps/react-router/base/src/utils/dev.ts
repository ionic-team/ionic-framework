export const isDevMode = () => {
  return process && process.env && process.env.NODE_ENV === 'development';
};

export const deprecationWarning = (message: string) => {
  if (isDevMode()) {
    console.warn(message);
  }
};
