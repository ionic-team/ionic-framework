declare namespace jest {
  interface Matchers<R> {
    toHaveShadowPart(part: string): R;
  }
}
