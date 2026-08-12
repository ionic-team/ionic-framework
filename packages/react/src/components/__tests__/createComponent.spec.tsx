/**
 * `createReactComponent` reaches nothing in `@ionic/core`, so the generated
 * wrapper can be driven directly, with no module to mock. These cases only fail
 * at the wrapper level: `render()` omits a nullish prop, so React emits no
 * attribute, and `componentDidUpdate` then writes one back through
 * `attachProps`.
 */
import { render } from '@testing-library/react';

import { createReactComponent } from '../react-component-lib/createComponent';

// Mirror how IonToggle is generated: a plain wrapper with no context or delegate.
const IonToggle = createReactComponent<any, any>('ion-toggle') as any;

const getToggle = () => document.querySelector('ion-toggle') as HTMLElement;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createReactComponent: nullish props', () => {
  it('should not render an attribute for a prop passed as undefined', () => {
    render(<IonToggle id={undefined} title={undefined} />);

    expect(getToggle().hasAttribute('id')).toEqual(false);
    expect(getToggle().hasAttribute('title')).toEqual(false);
  });

  it('should not render an attribute for a prop passed as null', () => {
    render(<IonToggle id={null} title={null} />);

    expect(getToggle().hasAttribute('id')).toEqual(false);
    expect(getToggle().hasAttribute('title')).toEqual(false);
  });

  it('should remove the attribute when a prop becomes undefined', () => {
    const { rerender } = render(<IonToggle id="my-id" />);
    expect(getToggle().getAttribute('id')).toEqual('my-id');

    rerender(<IonToggle id={undefined} />);

    expect(getToggle().hasAttribute('id')).toEqual(false);
  });

  it('should remove the attribute when a prop becomes null', () => {
    const { rerender } = render(<IonToggle id="my-id" />);
    expect(getToggle().getAttribute('id')).toEqual('my-id');

    rerender(<IonToggle id={null} />);

    expect(getToggle().hasAttribute('id')).toEqual(false);
  });
});
