import { win } from '@utils/browser';

/**
 * Configuration for safe-area CSS custom properties.
 * Values can be 'inherit' (use root value) or '0px' (no safe-area).
 */
export interface SafeAreaConfig {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

/**
 * Context information about the modal used to determine safe-area behavior.
 */
export interface ModalSafeAreaContext {
  isSheetModal: boolean;
  isCardModal: boolean;
  mode: 'ios' | 'md';
  presentingElement?: HTMLElement;
  breakpoints?: number[];
  currentBreakpoint?: number;
}

const TABLET_WIDTH = 768;
const EDGE_THRESHOLD = 5;

/**
 * Determines if the current viewport is tablet-sized (>= 768px width).
 */
export const isTabletViewport = (): boolean => {
  return win ? win.innerWidth >= TABLET_WIDTH : false;
};

/**
 * Returns the initial safe-area configuration based on modal type.
 * This is called before animation starts and uses configuration-based prediction.
 *
 * @param context - Modal context information
 * @returns SafeAreaConfig with initial safe-area values
 */
export const getInitialSafeAreaConfig = (context: ModalSafeAreaContext): SafeAreaConfig => {
  const { isSheetModal, isCardModal, mode } = context;

  // Sheet modals always use bottom safe-area only
  if (isSheetModal) {
    return {
      top: '0px',
      bottom: 'inherit',
      left: '0px',
      right: '0px',
    };
  }

  // Card modals (iOS only) need safe-area for height calculation
  if (isCardModal && mode === 'ios') {
    return {
      top: 'inherit',
      bottom: 'inherit',
      left: '0px',
      right: '0px',
    };
  }

  // Fullscreen and centered dialogs - inherit all, let position detection decide
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
 * @param wrapperEl - The modal wrapper element to measure
 * @param skipCoordinateDetection - If true, skips coordinate detection and returns inherit for all
 * @returns SafeAreaConfig based on position
 */
export const getPositionBasedSafeAreaConfig = (
  wrapperEl: HTMLElement,
  skipCoordinateDetection = false
): SafeAreaConfig => {
  // Skip coordinate detection for Android edge-to-edge compatibility
  // or when explicitly requested
  if (skipCoordinateDetection) {
    return {
      top: 'inherit',
      bottom: 'inherit',
      left: 'inherit',
      right: 'inherit',
    };
  }

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
