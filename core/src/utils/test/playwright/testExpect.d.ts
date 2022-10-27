interface CustomMatchers<R = unknown> {
  /**
   * Will check if the event spy received the expected event.
   */
  toHaveReceivedEvent(): R;
  /**
   * Will check if the event spy received the expected event with the expected detail.
   * @param eventDetail The expected detail of the event.
   */
  toHaveReceivedEventDetail(eventDetail: any): R;

  /**
   * Will check how many times the event has been received.
   */
  toHaveReceivedEventTimes(count: number): R;
}

declare namespace PlaywrightTest {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Matchers<R> extends CustomMatchers<R> {}
}
