import { win } from '@utils/browser';
import { onCustomPropertyChange, raf } from '@utils/helpers';
import { getOverlaySizeType } from '@utils/overlays';

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
 * Indicates whether the modal spans the viewport on each axis.
 *
 * `vertical` means the modal reaches both the top and bottom edges.
 * `horizontal` means the modal reaches both the left and right edges.
 */
export interface ModalCoveredAxes {
  vertical: boolean;
  horizontal: boolean;
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

  /**
   * Only used by `getInitialSafeAreaConfig()` to predict safe-area
   * requirements before the modal is presented. Callers that only use
   * the context for non-initial paths can omit this.
   */
  coveredAxes?: ModalCoveredAxes;
}

const EDGE_THRESHOLD = 5;

/**
 * Cache for resolved root safe-area-top value, invalidated once per frame.
 */
let cachedRootSafeAreaTop: number | null = null;
let cacheInvalidationScheduled = false;

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
 * Calls back when the resolved root `--ion-safe-area-top` changes. The value
 * the caller already applied is passed as the baseline, so a change between
 * that read and the observer starting is still reported.
 */
export const onRootSafeAreaTopChange = (callback: (safeAreaTop: number) => void): (() => void) => {
  return onCustomPropertyChange(win?.document?.body, '--ion-safe-area-top', callback, getRootSafeAreaTop());
};

/**
 * Determines which viewport axes the modal spans so safe-area requirements
 * can be predicted independently for each axis.
 *
 * A modal that spans an axis reaches both edges on that axis and needs the
 * corresponding safe-area insets. A modal that does not span an axis reaches
 * neither edge on that axis.
 *
 * When both `--width` and `--height` are `fullscreen`, coverage can be
 * determined directly. Otherwise, coverage is based on the rendered wrapper,
 * including cases where content sizing or `--max-height` causes the modal
 * to reach the viewport.
 */
export const getModalCoveredAxes = (hostEl: HTMLElement): ModalCoveredAxes => {
  const styles = getComputedStyle(hostEl);
  const width = getOverlaySizeType(styles.getPropertyValue('--width'));
  const height = getOverlaySizeType(styles.getPropertyValue('--height'));

  if (width === 'fullscreen' && height === 'fullscreen') {
    return { vertical: true, horizontal: true };
  }

  return measureCoveredAxes(hostEl);
};

/**
 * Measures the modal wrapper to determine whether it spans the viewport
 * on each axis.
 *
 * The wrapper has no box while the modal is hidden, so `overlay-hidden`
 * is temporarily removed to allow the wrapper to be measured. The class
 * is restored in the same task before the browser can paint.
 *
 * Only the wrapper's size is measured. Its position is affected by the
 * enter animation, which initially translates it by its own height, while
 * the translation does not affect its measured size.
 */
const measureCoveredAxes = (hostEl: HTMLElement): ModalCoveredAxes => {
  const wrapperEl = hostEl.shadowRoot?.querySelector('.modal-wrapper');
  if (wrapperEl == null || win === undefined) {
    return { vertical: false, horizontal: false };
  }

  const wasHidden = hostEl.classList.contains('overlay-hidden');
  if (wasHidden) {
    hostEl.classList.remove('overlay-hidden');
  }

  const { width, height } = wrapperEl.getBoundingClientRect();

  if (wasHidden) {
    hostEl.classList.add('overlay-hidden');
  }

  return {
    vertical: height >= win.innerHeight - EDGE_THRESHOLD,
    horizontal: width >= win.innerWidth - EDGE_THRESHOLD,
  };
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

  /**
   * Each axis is evaluated independently because a modal can span one axis
   * without spanning the other. This allows the initial safe-area configuration
   * to match the modal's expected dimensions and avoids correcting an incorrect
   * pair of insets after presentation.
   *
   * A modal can span the horizontal axis while remaining inset vertically, or
   * span the vertical axis while remaining inset horizontally. Wide viewports
   * can also render regular modals as centered dialogs, while content-sized
   * modals may still be clamped to the viewport.
   */
  const { vertical, horizontal } = context.coveredAxes ?? { vertical: true, horizontal: true };

  return {
    top: vertical ? 'inherit' : '0px',
    bottom: vertical ? 'inherit' : '0px',
    left: horizontal ? 'inherit' : '0px',
    right: horizontal ? 'inherit' : '0px',
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
