import { componentOnReady } from '../helpers';

describe('componentOnReady()', () => {
  it('should correctly call callback for a custom element', async (done) => {
    customElements.define('hello-world', class extends HTMLElement {
      constructor() {
        super();
      }
    });

    const component = document.createElement('hello-world');
    componentOnReady(component, () => done())
  });

  it('should correctly call callback for a lazy loaded component', async (done) => {
    customElements.define('hello-world', class extends HTMLElement {
      constructor() {
        super();
      }

      componentOnReady() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 250);
        })
      }
    });

    const component = document.createElement('hello-world');
    componentOnReady(component, () => done())
  });
});
