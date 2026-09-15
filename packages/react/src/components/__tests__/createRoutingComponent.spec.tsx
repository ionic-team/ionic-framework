// Jest can't import Ionic's ESM-only custom elements; stub the values the
// wrapper's util chain reaches.
jest.mock('@ionic/core/components', () => ({
  getPlatforms: () => [],
  isPlatform: () => false,
  componentOnReady: (_el: HTMLElement, cb: () => void) => cb(),
}));

import { act, render } from '@testing-library/react';

import { createRoutingComponent } from '../createRoutingComponent';

/**
 * Routing-wrapped components (ion-button, ion-card, ion-fab-button,
 * ion-item-option, ion-breadcrumb, ion-router-link) go through
 * `createRoutingComponent`, which is not covered by the @lit/react runtime that
 * fixes the generated components on v9. `disabled={false}` must not leave a
 * stray `disabled="false"` on the host, since presence of an HTML boolean
 * attribute means "true" to assistive tech.
 */
const RoutingEl = createRoutingComponent<any, any>('fake-routing-el');

describe('createRoutingComponent boolean attributes', () => {
  it('should not leave a disabled="false" attribute when disabled={false}', () => {
    const { container } = render(<RoutingEl disabled={false}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('should preserve aria-* attributes set to false (meaningful, not boolean attributes)', () => {
    const { container } = render(<RoutingEl aria-expanded={false}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    // aria-expanded="false" means "collapsed", distinct from the attribute being absent.
    expect(el.getAttribute('aria-expanded')).toBe('false');
  });

  it('should preserve enumerated attributes set to false (e.g. draggable)', () => {
    const { container } = render(<RoutingEl draggable={false}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    // draggable="false" explicitly disables dragging, distinct from absence.
    expect(el.getAttribute('draggable')).toBe('false');
  });

  it('should preserve camelCased enumerated attributes set to false (e.g. spellCheck)', () => {
    const { container } = render(<RoutingEl spellCheck={false}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    // The wrapper dash-cases React prop names, so spellCheck renders as
    // spell-check; spell-check="false" is meaningful and must survive.
    expect(el.getAttribute('spell-check')).toBe('false');
  });

  it('should keep the disabled attribute when disabled={true}', () => {
    const { container } = render(<RoutingEl disabled={true}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('should disable the element when toggling disabled false -> true', () => {
    const { container, rerender } = render(<RoutingEl disabled={false}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;
    expect(el.hasAttribute('disabled')).toBe(false);

    act(() => {
      rerender(<RoutingEl disabled={true}>x</RoutingEl>);
    });

    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('should drop the attribute when toggling disabled true -> false', () => {
    const { container, rerender } = render(<RoutingEl disabled={true}>x</RoutingEl>);
    const el = container.querySelector('fake-routing-el')!;

    act(() => {
      rerender(<RoutingEl disabled={false}>x</RoutingEl>);
    });

    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('should not re-add disabled="false" after an unrelated re-render', () => {
    const { container, rerender } = render(
      <RoutingEl disabled={false} title="a">
        x
      </RoutingEl>
    );
    const el = container.querySelector('fake-routing-el')!;

    act(() => {
      rerender(
        <RoutingEl disabled={false} title="b">
          x
        </RoutingEl>
      );
    });

    expect(el.hasAttribute('disabled')).toBe(false);
  });
});
