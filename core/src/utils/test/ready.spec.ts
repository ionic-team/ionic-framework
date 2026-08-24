// @vitest-environment stencil

import { componentOnReady } from '../helpers';

describe('componentOnReady()', () => {
  it('should correctly call callback for a custom element', async () => {
    customElements.define(
      'hello-world',
      class extends HTMLElement {
        constructor() {
          super();
        }
      }
    );

    const component = document.createElement('hello-world');
    const el = await new Promise<HTMLElement>((resolve) => componentOnReady(component, resolve));
    expect(el).toBe(component);
  });

  it('should correctly call callback for a lazy loaded component', async () => {
    const cb = vi.fn((el) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(el), 250);
      });
    });

    customElements.define(
      'hello-world',
      class extends HTMLElement {
        constructor() {
          super();
        }

        componentOnReady() {
          return cb(this);
        }
      }
    );

    const component = document.createElement('hello-world');
    const el = await new Promise<HTMLElement>((resolve) => componentOnReady(component, resolve));
    expect(el).toBe(component);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
