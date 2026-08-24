import 'vitest';

interface CustomMatchers<R = unknown> {
  toHaveShadowPart(partName: string): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
