import { isRTL } from '@utils/rtl';

interface BadgePositionConfig {
  /**
   * The badge element to position.
   */
  badge: HTMLElement;

  /**
   * The host element. Used to determine text direction (RTL/LTR).
   *
   * If omitted and `target` is inside a shadow root, the shadow
   * root's host is used automatically. If `target` is in the
   * light DOM, `target` itself is used.
   *
   * Required only when the shadow host cannot be inferred from
   * `target` (e.g. the host is a grandparent of the shadow root).
   */
  host?: HTMLElement;

  /**
   * The element the badge visually anchors to.
   *
   * Examples:
   *   - Avatar: the host element (avatar itself)
   *   - Button: `.button-native` within the button
   *   - Tab button: the `ion-icon` or `ion-label` within the tab button
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
   * Defaults to `true`.
   */
  clamp?: boolean;

  /**
   * If `true`, the badge overlaps the target's inline-end edge by a fixed
   * amount, with the top/bottom edge aligned to the target's top/bottom edge.
   *
   * If `false` (default), the badge is positioned at the corner of the target
   * using arc-based math.
   *
   * Set to `true` for non-round targets like tab button icons.
   * Omit (or `false`) for targets that use corner positioning, like avatars,
   * buttons, and tab button labels.
   */
  anchorToEdge?: boolean;
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
 * Positions a badge relative to a target element.
 *
 * Two modes are selected via `anchorToEdge`:
 *
 * - Arc-based (default, `anchorToEdge: false`): Places the badge at the
 *   45 degree point on the target's corner arc using `borderRadius * 0.2929`.
 *   Used for avatars, buttons, and tab button labels.
 *
 * - Fixed overlap (`anchorToEdge: true`): Positions the badge so it overlaps
 *   the target's inline-end edge by `OVERLAP` pixels, with the top/bottom edge
 *   aligned to the target's top/bottom edge. Used for tab button icons.
 *
 * If `relativeTo` is provided, the position accounts for the delta between
 * the target and the badge's positioned ancestor.
 *
 * @param config The configuration for badge positioning
 */
export function positionBadge(config: BadgePositionConfig): void {
  const { badge, target, clamp = true } = config;
  const relativeTo = config.relativeTo ?? target;
  const rootNode = target.getRootNode();
  const host =
    config.host ?? (rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement) : (target as HTMLElement));
  const rtl = isRTL(host);
  const OVERLAP = 6;

  const targetRect = target.getBoundingClientRect();
  const relativeToRect = relativeTo.getBoundingClientRect();
  const vertical = badge.getAttribute('vertical');

  // Delta from the relativeTo element's edges to the target's edges
  const deltaTop = targetRect.top - relativeToRect.top;
  const deltaBottom = relativeToRect.bottom - targetRect.bottom;
  // Horizontal delta flips depending on direction
  const deltaInlineEnd = rtl ? targetRect.left - relativeToRect.left : relativeToRect.right - targetRect.right;

  let inlineStart: number;
  let top: number;
  let bottom: number;

  if (config.anchorToEdge) {
    /**
     * Fixed overlap: badge overlaps the target's inline-end edge by
     * OVERLAP pixels, top/bottom edge aligned with target's top/bottom
     * edge.
     */
    inlineStart = relativeToRect.width - deltaInlineEnd - OVERLAP;
    top = deltaTop;
    bottom = deltaBottom;
  } else {
    /**
     * Arc-based: badge center placed at the 45 degree point on the target's
     * corner arc.
     */
    const computedStyles = getComputedStyle(target);
    let borderRadius = parseFloat(computedStyles.borderTopRightRadius) || 0;
    const maxRadius = Math.min(targetRect.width, targetRect.height) / 2;
    borderRadius = Math.min(borderRadius, maxRadius);

    // 0.2929 = 1 - cos(45°)
    const cornerOffset = borderRadius * 0.2929;
    const badgeRect = badge.getBoundingClientRect();

    inlineStart = relativeToRect.width - cornerOffset - deltaInlineEnd - OVERLAP / 2;
    top = cornerOffset + deltaTop - badgeRect.height / 2;
    bottom = cornerOffset + deltaBottom - badgeRect.height / 2;
  }

  // Optionally clamp so the badge doesn't extend past the target's edges
  const clampedTop = clamp ? Math.max(top, deltaTop) : top;
  const clampedBottom = clamp ? Math.max(bottom, deltaBottom) : bottom;

  badge.style.insetInlineStart = `${inlineStart}px`;

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

  /**
   * The badge itself must also be observed. Arc-based positioning uses
   * `badgeRect.height / 2` for both top and bottom offsets, so if the
   * badge resizes after initial layout (e.g. count changes from "9" to
   * "99+") the position would be stale by half the height delta.
   */
  observer.observe(config.badge);

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
