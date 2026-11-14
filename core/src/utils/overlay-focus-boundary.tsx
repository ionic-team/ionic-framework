import type { FunctionalComponent } from '@stencil/core';
import { h } from '@stencil/core';
import { focusFirstDescendant, focusLastDescendant } from '@utils/focus-trap';

interface OverlayFocusBoundaryProps {
  /** The overlay host element. */
  overlay: HTMLElement;
  /** Whether the boundary renders before or after the overlay content. */
  edge: 'start' | 'end';
}

/**
 * Moves focus off a boundary. Focus arriving from inside the overlay
 * wraps to the opposite end. Focus arriving from outside enters at the
 * nearest end.
 */
const onBoundaryFocus = (overlay: HTMLElement, ev: FocusEvent, edge: 'start' | 'end') => {
  /**
   * Shadow overlays search their slotted content. Scoped overlays search
   * their wrapper, since the boundaries are siblings of it in the same
   * tree and would otherwise be found first.
   */
  const container = overlay.shadowRoot ? overlay : overlay.querySelector<HTMLElement>('.ion-overlay-wrapper');
  if (!container) {
    return;
  }

  const from = ev.relatedTarget as Node | null;
  const fromInside =
    from !== null && from !== overlay && (overlay.contains(from) || overlay.shadowRoot?.contains(from) === true);
  const focusFirst = edge === 'start' ? !fromInside : fromInside;

  if (focusFirst) {
    focusFirstDescendant(container, overlay);
  } else {
    focusLastDescendant(container, overlay);
  }
};

/**
 * Renders a focusable element before or after an overlay's content that
 * keeps Tab inside the overlay. The document focus listener in overlays.ts
 * cannot do this alone, since browsers can move focus past the end of the
 * page without firing a focus event.
 */
export const OverlayFocusBoundary: FunctionalComponent<OverlayFocusBoundaryProps> = ({ overlay, edge }) => (
  <div
    class="ion-overlay-focus-boundary"
    tabIndex={0}
    aria-hidden="true"
    onFocus={(ev) => onBoundaryFocus(overlay, ev, edge)}
  ></div>
);
