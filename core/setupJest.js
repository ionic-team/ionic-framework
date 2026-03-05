expect.extend({
  toHaveShadowPart(received, part) {
    if (typeof part !== 'string') {
      throw new Error('expected toHaveShadowPart to be called with a string of the CSS shadow part name');
    }

    if (received.shadowRoot === null) {
      throw new Error('expected toHaveShadowPart to be called on an element with a shadow root');
    }

    // Use attribute selector with ~= to match space-separated part values
    // e.g., [part~="knob"] matches elements with part="knob" or part="knob knob-a"
    const shadowPart = received.shadowRoot.querySelector(`[part~="${part}"]`);
    const pass = shadowPart !== null;

    const message = `expected ${received.tagName.toLowerCase()} to have shadow part "${part}"`;

    return {
      pass,
      message: () => message,
    };
  },
});
