import { act, render } from '@testing-library/react';

import { createReactComponent } from '../createComponent';

/**
 * Components built with createReactComponent (e.g. IonBackButton, IonTabButton
 * via inner-proxies) render attributes directly and sync props through
 * attachProps, so they must get the same `disabled="false"` stripping as
 * routing-wrapped components. Presence of an HTML boolean attribute means "true"
 * to assistive tech, so a false-valued boolean must not leave a stray attribute.
 */
const ReactEl = createReactComponent<any, any>('fake-react-el');

describe('createReactComponent boolean attributes', () => {
  it('should not leave a disabled="false" attribute when disabled={false}', () => {
    const { container } = render(<ReactEl disabled={false}>x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('should preserve aria-* attributes set to false', () => {
    const { container } = render(<ReactEl aria-expanded={false}>x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    expect(el.getAttribute('aria-expanded')).toBe('false');
  });

  it('should keep the disabled attribute when disabled={true}', () => {
    const { container } = render(<ReactEl disabled={true}>x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('should drop the attribute when toggling disabled true -> false', () => {
    const { container, rerender } = render(<ReactEl disabled={true}>x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    act(() => {
      rerender(<ReactEl disabled={false}>x</ReactEl>);
    });

    expect(el.hasAttribute('disabled')).toBe(false);
  });
});

/**
 * These only fail at the wrapper level: render() omits a nullish prop, so React
 * emits no attribute, and componentDidUpdate then writes one back through
 * attachProps. A direct attachProps call cannot see that interaction.
 */
describe('createReactComponent nullish props', () => {
  it('should not render an attribute for a prop passed as undefined', () => {
    const { container } = render(
      <ReactEl id={undefined} title={undefined}>
        x
      </ReactEl>
    );
    const el = container.querySelector('fake-react-el')!;

    expect(el.hasAttribute('id')).toBe(false);
    expect(el.hasAttribute('title')).toBe(false);
  });

  it('should not render an attribute for a prop passed as null', () => {
    const { container } = render(
      <ReactEl id={null} title={null}>
        x
      </ReactEl>
    );
    const el = container.querySelector('fake-react-el')!;

    expect(el.hasAttribute('id')).toBe(false);
    expect(el.hasAttribute('title')).toBe(false);
  });

  it('should drop the attribute when a prop becomes undefined', () => {
    const { container, rerender } = render(<ReactEl id="my-id">x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    act(() => {
      rerender(<ReactEl id={undefined}>x</ReactEl>);
    });

    expect(el.hasAttribute('id')).toBe(false);
  });

  it('should drop the attribute when a prop becomes null', () => {
    const { container, rerender } = render(<ReactEl id="my-id">x</ReactEl>);
    const el = container.querySelector('fake-react-el')!;

    act(() => {
      rerender(<ReactEl id={null}>x</ReactEl>);
    });

    expect(el.hasAttribute('id')).toBe(false);
  });
});
