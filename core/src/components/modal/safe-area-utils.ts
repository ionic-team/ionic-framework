import { win } from '@utils/browser';
import { raf } from '@utils/helpers';

type SafeAreaValue = '0px' | 'inherit';

/**
 * Configuration for safe-area CSS custom properties.
 * Each direction can inherit the root safe-area value or be zeroed out.
 */
export interface SafeAreaConfig {
  top: SafeAreaValue;
  bottom: SafeAreaValue;
  left: SafeAreaValue;
  right: SafeAreaValue;
}

/**
 * Context information about the modal used to determine safe-area behavior.
 */
export interface ModalSafeAreaContext {
  isSheetModal: boolean;
  isCardModal: boolean;
  presentingElement?: HTMLElement;
  breakpoints?: number[];
  currentBreakpoint?: number;
}

/**
 * These thresholds match the SCSS media query breakpoints in modal.vars.scss
 * that trigger the centered dialog layout (non-fullscreen modal).
 *
 * SCSS defines two height breakpoints: $modal-inset-min-height-small (600px)
 * and $modal-inset-min-height-large (768px). We use the smaller one because
 * that's the threshold where the modal transitions from fullscreen to centered
 * dialog — the larger breakpoint only increases the dialog's height.
 */
const MODAL_INSET_MIN_WIDTH = 768;
const MODAL_INSET_MIN_HEIGHT = 600;
const EDGE_THRESHOLD = 5;

/**
 * Cache for resolved root safe-area-top value, invalidated once per frame.
 */
let cachedRootSafeAreaTop: number | null = null;
let cacheInvalidationScheduled = false;

/**
 * Determines if the current viewport meets the CSS media query conditions
 * that cause regular modals to render as centered dialogs instead of fullscreen.
 * Matches: @media (min-width: 768px) and (min-height: 600px)
 */
const isCenteredDialogViewport = (): boolean => {
  if (!win) return false;
  return win.matchMedia(`(min-width: ${MODAL_INSET_MIN_WIDTH}px) and (min-height: ${MODAL_INSET_MIN_HEIGHT}px)`)
    .matches;
};

/**
 * Resolves the current root --ion-safe-area-top value to pixels.
 * Uses a temporary element because getComputedStyle on :root returns
 * the declared value of custom properties (e.g. "env(safe-area-inset-top)")
 * rather than a resolved number.
 *
 * Results are cached for the current frame to avoid repeated reflows.
 */
export const getRootSafeAreaTop = (): number => {
  if (cachedRootSafeAreaTop !== null) {
    return cachedRootSafeAreaTop;
  }

  const doc = win?.document;
  if (!doc?.body) {
    return 0;
  }

  const el = doc.createElement('div');
  el.style.cssText =
    'position:fixed;visibility:hidden;pointer-events:none;top:0;left:0;' + 'padding-top:var(--ion-safe-area-top,0px);';
  doc.body.appendChild(el);
  const value = parseFloat(getComputedStyle(el).paddingTop) || 0;
  el.remove();

  cachedRootSafeAreaTop = value;
  if (!cacheInvalidationScheduled) {
    cacheInvalidationScheduled = true;
    raf(() => {
      cachedRootSafeAreaTop = null;
      cacheInvalidationScheduled = false;
    });
  }

  return value;
};

/**
 * Returns the initial safe-area configuration based on modal type.
 * This is called before animation starts and uses configuration-based prediction.
 *
 * @param context - Modal context information
 * @returns SafeAreaConfig with initial safe-area values
 */
export const getInitialSafeAreaConfig = (context: ModalSafeAreaContext): SafeAreaConfig => {
  const { isSheetModal, isCardModal } = context;

  // Sheet modals always zero top safe-area. The sheet height offset from the
  // top edge is handled by --ion-modal-offset-top (set in modal.tsx) using
  // the resolved root value, so --ion-safe-area-top is never needed for
  // height calculation. Keeping it at 0px prevents header content from
  // getting double-offset padding.
  if (isSheetModal) {
    return {
      top: '0px',
      bottom: 'inherit',
      left: '0px',
      right: '0px',
    };
  }

  // Card modals need safe-area for height calculation.
  // Note: isCardModal is already gated on mode === 'ios' by the caller.
  if (isCardModal) {
    return {
      top: 'inherit',
      bottom: 'inherit',
      left: '0px',
      right: '0px',
    };
  }

  // On viewports that meet the centered dialog media query breakpoints,
  // regular modals render as centered dialogs (not fullscreen), so they
  // don't touch any screen edges and don't need safe-area insets.
  if (isCenteredDialogViewport()) {
    return {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
    };
  }

  // Fullscreen modals on phone - inherit all safe areas
  return {
    top: 'inherit',
    bottom: 'inherit',
    left: 'inherit',
    right: 'inherit',
  };
};

/**
 * Returns safe-area configuration based on actual modal position.
 * Detects which edges the modal overlaps with and only applies safe-area to those edges.
 *
 * Note: On Android edge-to-edge (API 36+), getBoundingClientRect() may report
 * inconsistent values. Sheet and card modals avoid this by using configuration-based
 * prediction instead. Regular modals use coordinate detection which works reliably
 * on web and iOS; Android edge-to-edge may need a configuration-based fallback
 * once a reliable detection mechanism is available.
 *
 * @param wrapperEl - The modal wrapper element to measure
 * @returns SafeAreaConfig based on position
 */
export const getPositionBasedSafeAreaConfig = (wrapperEl: HTMLElement): SafeAreaConfig => {
  const rect = wrapperEl.getBoundingClientRect();
  const vh = win?.innerHeight ?? 0;
  const vw = win?.innerWidth ?? 0;

  // Only apply safe-area to sides where modal overlaps with screen edge
  return {
    top: rect.top <= EDGE_THRESHOLD ? 'inherit' : '0px',
    bottom: rect.bottom >= vh - EDGE_THRESHOLD ? 'inherit' : '0px',
    left: rect.left <= EDGE_THRESHOLD ? 'inherit' : '0px',
    right: rect.right >= vw - EDGE_THRESHOLD ? 'inherit' : '0px',
  };
};

/**
 * Applies safe-area CSS custom property overrides to the modal host element.
 *
 * @param hostEl - The modal host element (ion-modal)
 * @param config - Safe-area configuration to apply
 */
export const applySafeAreaOverrides = (hostEl: HTMLElement, config: SafeAreaConfig): void => {
  hostEl.style.setProperty('--ion-safe-area-top', config.top);
  hostEl.style.setProperty('--ion-safe-area-bottom', config.bottom);
  hostEl.style.setProperty('--ion-safe-area-left', config.left);
  hostEl.style.setProperty('--ion-safe-area-right', config.right);
};

/**
 * Clears safe-area CSS custom property overrides from the modal host element.
 *
 * @param hostEl - The modal host element (ion-modal)
 */
export const clearSafeAreaOverrides = (hostEl: HTMLElement): void => {
  hostEl.style.removeProperty('--ion-safe-area-top');
  hostEl.style.removeProperty('--ion-safe-area-bottom');
  hostEl.style.removeProperty('--ion-safe-area-left');
  hostEl.style.removeProperty('--ion-safe-area-right');
};
