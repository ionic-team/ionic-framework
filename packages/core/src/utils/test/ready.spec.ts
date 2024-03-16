import { componentOnReady } from '../helpers';

describe('componentOnReady()', () => {
  it('should correctly call callback for a custom element', (done) => {
    customElements.define(
      'hello-world',
      class extends HTMLElement {
        constructor() {
          super();
        }
      }
    );

    const component = document.createElement('hello-world');
    componentOnReady(component, (el: HTMLElement) => {
      expect(el).toBe(component);
      done();
    });
  });

  it('should correctly call callback for a lazy loaded component', (done) => {
    const cb = jest.fn((el) => {
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
    componentOnReady(component, (el: HTMLElement) => {
      expect(el).toBe(component);
      expect(cb).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
