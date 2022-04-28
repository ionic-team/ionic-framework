export {};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveReceivedEvent(): R;
    }
  }
}
