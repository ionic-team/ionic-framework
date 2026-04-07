import { isRTL } from '@utils/rtl';

interface BadgePositionConfig {
  /**
   * The badge element to position.
   */
  badge: HTMLElement;

  /**
   * The host element. Used to determine text direction (RTL/LTR).
   *
   * If omitted, `target` is used for direction detection.
   */
  host?: HTMLElement;

  /**
   * The element the badge visually anchors to. Its border-radius
   * defines the corner arc, and the badge center is placed at
   * the 45 degrees point on that arc.
   *
   * Examples:
   *   - Avatar: the host element
   *   - Button: .button-native
   *   - Tab button: the sibling ion-icon
   */
  target: Element;

  /**
   * The element that the badge's `position: absolute` resolves
   * against (its nearest positioned ancestor). Only needed when
   * this differs from `target`.
   *
   * If omitted, the badge is assumed to resolve against `target`.
   *
   * Examples:
   *   - Avatar: omitted (badge resolves against host)
   *   - Button: .button-inner (has position: relative)
   *   - Tab button: .button-inner (has position: relative)
   */
  relativeTo?: Element;

  /**
   * If `true`, clamps the badge's vertical position so it does
   * not extend past the top or bottom edge of `target`.
   *
   * Useful when the badge is anchored to a sibling and nearby
   * content (like a label) would otherwise be overlapped.
   */
  clamp?: boolean;
}

/**
 * Manages the lifecycle of a badge observer for a component.
 * Handles setup, cleanup, and slot change detection so each
 * component only needs to define how to build its config.
 */
interface BadgeManager {
  // Set up the badge observer. Call in componentDidLoad.
  init: () => void;
  // Tear down the badge observer. Call in disconnectedCallback.
  destroy: () => void;
  // Handle slot changes. Call in onSlotchange handler.
  onSlotChanged: () => void;
}

/**
 * Positions a badge at the 45 degrees point on a target element's
 * corner arc, placing the badge center on the curve defined
 * by the target's border radius.
 *
 * The offset from the corner is calculated as:
 *
 *   borderRadius * 0.2929 - badgeSize / 2
 *
 * Where 0.2929 = 1 - cos(45 degrees). This naturally adapts to radius: circular, pill, rounded, or rectangular.
 *
 * If `relativeTo` is provided, the position accounts for
 * the delta between the target and the badge's positioned
 * ancestor (e.g. `.button-inner` with `position: relative`).
 *
 * If `clamp` is true, the badge is constrained to the
 * target's edges so it doesn't overlap adjacent content.
 *
 * @param config The configuration for badge positioning
 */
export function positionBadge(config: BadgePositionConfig): void {
  const { badge, target, clamp } = config;
  const relativeTo = config.relativeTo ?? target;
  const host = (config.host ?? target) as HTMLElement;
  const rtl = isRTL(host);

  const targetRect = target.getBoundingClientRect();
  const relativeToRect = relativeTo.getBoundingClientRect();

  // Delta from the relativeTo element's edges to the target's edges
  const deltaTop = targetRect.top - relativeToRect.top;
  const deltaBottom = relativeToRect.bottom - targetRect.bottom;
  // Horizontal delta flips depending on direction
  const deltaInlineEnd = rtl ? targetRect.left - relativeToRect.left : relativeToRect.right - targetRect.right;

  // Resolve border-radius of the target element
  const computedStyles = getComputedStyle(target);
  let borderRadius = parseFloat(computedStyles.borderTopRightRadius) || 0;

  // Clamp to half the smallest dimension (matches browser behavior)
  const maxRadius = Math.min(targetRect.width, targetRect.height) / 2;
  borderRadius = Math.min(borderRadius, maxRadius);

  // 0.2929 = 1 - cos(45°)
  const cornerOffset = borderRadius * 0.2929;

  const vertical = badge.getAttribute('vertical');
  const badgeRect = badge.getBoundingClientRect();

  /**
   * Uses `left` instead of `right` for horizontal positioning
   * so wider badges (e.g. "999+") extend outward (to the right)
   */
  const inlineStart = relativeToRect.width - cornerOffset - deltaInlineEnd - badgeRect.height / 2;
  const top = cornerOffset + deltaTop - badgeRect.height / 2;
  const bottom = cornerOffset + deltaBottom - badgeRect.height / 2;

  // Optionally clamp so the badge doesn't extend past the target's edges
  const clampedTop = clamp ? Math.max(top, deltaTop) : top;
  const clampedBottom = clamp ? Math.max(bottom, deltaBottom) : bottom;

  // Set horizontal position based on direction
  if (rtl) {
    badge.style.right = `${inlineStart}px`;
    badge.style.left = '';
  } else {
    badge.style.left = `${inlineStart}px`;
    badge.style.right = '';
  }

  if (vertical === 'top') {
    badge.style.top = `${clampedTop}px`;
    badge.style.bottom = '';
  } else if (vertical === 'bottom') {
    badge.style.bottom = `${clampedBottom}px`;
    badge.style.top = '';
  }
}

export interface BadgeObserver {
  disconnect: () => void;
}

/**
 * Creates a ResizeObserver that repositions the badge whenever
 * the target element changes size.
 *
 * @param config The configuration for badge positioning and observation
 * @returns BadgeObserver
 */
export function createBadgeObserver(config: BadgePositionConfig): BadgeObserver {
  const observer = new ResizeObserver(() => {
    positionBadge(config);
  });

  observer.observe(config.target);

  /**
   * The `relativeTo` element must also be observed when it differs
   * from `target`. Slotted content (like `ion-icon`) may render
   * asynchronously after the parent component loads, causing
   * `relativeTo` to resize to its final dimensions in a later
   * frame. Without observing it, the badge position would be
   * calculated against stale dimensions and never corrected.
   */
  const relativeTo = config.relativeTo ?? config.target;
  if (relativeTo !== config.target) {
    observer.observe(relativeTo);
  }

  return {
    disconnect: () => observer.disconnect(),
  };
}

/**
 * Creates a BadgeManager for a host element.
 *
 * @param host The element that has the slotted badge.
 * @param getConfig A function that returns the config for the badge observer.
 */
export function createBadgeManager(
  host: HTMLElement,
  getConfig: () => Omit<BadgePositionConfig, 'badge'> | undefined
): BadgeManager {
  let observer: BadgeObserver | undefined;

  const getBadge = () => {
    return host.querySelector('ion-badge[vertical]') as HTMLElement | null;
  };

  const setup = () => {
    observer?.disconnect();
    observer = undefined;

    const badge = getBadge();
    if (!badge) {
      return;
    }

    const config = getConfig();
    // If config is undefined, it means the target element (e.g. ion-icon) wasn't found, so an observer shouldn't be created.
    if (!config) {
      return;
    }

    observer = createBadgeObserver({ ...config, badge });
  };

  const destroy = () => {
    observer?.disconnect();
    observer = undefined;
  };

  const onSlotChanged = () => {
    /**
     * Badges can be added or removed dynamically to mimic use
     * cases like notifications. Based on the presence of a
     * badge, we need to set up or destroy the badge observer.
     *
     * If the badge observer is already set up and there is a
     * badge, then we don't need to do anything.
     */
    const badge = getBadge();

    if (badge && observer) {
      return;
    }

    if (badge) {
      setup();
    } else {
      destroy();
    }
  };

  return {
    init: setup,
    destroy,
    onSlotChanged,
  };
}
