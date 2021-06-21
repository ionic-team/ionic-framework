import '@testing-library/jest-dom/extend-expect';

window.matchMedia =
  window.matchMedia ||
  (function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  } as any);
