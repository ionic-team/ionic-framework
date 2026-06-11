/*
 * addRipple does its DOM work inside Stencil's readTask/writeTask queue. Run them
 * synchronously so addRipple completes within the test without the render loop.
 * This mock must be declared before importing the component so the component picks
 * up the mocked tasks. Everything else from @stencil/core is preserved.
 */
jest.mock('@stencil/core', () => {
  const actual = jest.requireActual('@stencil/core');
  return {
    ...actual,
    readTask: (callback: () => void) => callback(),
    writeTask: (callback: () => void) => callback(),
  };
});

// eslint-disable-next-line import/first
import { RippleEffect } from '../ripple-effect';

/* Minimal host stand-in so addRipple's geometry math and append have something to run against. */
const mockHost = (isConnected: boolean, appendChild = jest.fn()) =>
  ({
    isConnected,
    getBoundingClientRect: () => ({ width: 100, height: 100, left: 0, top: 0 } as DOMRect),
    shadowRoot: { appendChild, querySelector: () => null },
  } as unknown as HTMLElement);

describe('ripple-effect: addRipple', () => {
  it('should resolve with a callable no-op and append nothing when the host is disconnected', async () => {
    const ripple = new RippleEffect();
    const appendChild = jest.fn();

    // Set the host as disconnected
    Object.defineProperty(ripple, 'el', { value: mockHost(false, appendChild), configurable: true });

    // Must settle and hand back a callable cleanup the consumer can invoke
    const cleanup = await ripple.addRipple(0, 0);

    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();

    // The guard should short-circuit before any ripple element is appended
    expect(appendChild).not.toHaveBeenCalled();
  });
});
