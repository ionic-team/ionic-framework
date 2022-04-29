interface CustomMatchers<R = unknown> {
  /**
   * Will check if the event spy received the expected event.
   */
  toHaveReceivedEvent(): R;
}

declare namespace PlaywrightTest {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Matchers<R> extends CustomMatchers<R> {}
}
