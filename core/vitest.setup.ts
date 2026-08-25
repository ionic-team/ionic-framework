import { afterAll, expect, vi } from 'vitest';

// Registers Stencil's custom DOM matchers (toHaveClass, toEqualHtml, toHaveShadowRoot, etc.)
// as global `expect` matchers, for the handful of spec files that use them.
import '@stencil/vitest';

// Several components fire-and-forget a dynamic `import('../../utils/gesture')` from
// componentDidLoad. If the file's environment tears down before that settles, Vitest
// reports an unhandled rejection. `afterAll` (once per file, after its last test) gives
// it time to resolve first; `afterEach` made this worse by catching imports mid-flight
// more often. Skipped under fake timers, which would never let `setTimeout` fire.
afterAll(async () => {
  if (!vi.isFakeTimers()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
});

expect.extend({
  toHaveShadowPart(received: Element, partName: string) {
    const shadowRoot = received?.shadowRoot;
    const pass = shadowRoot != null && shadowRoot.querySelector(`[part~="${partName}"]`) != null;
    return {
      pass,
      message: () =>
        `expected ${received?.tagName?.toLowerCase()}'s shadow root ${pass ? 'not ' : ''}to have an element with part "${partName}"`,
    };
  },
});
