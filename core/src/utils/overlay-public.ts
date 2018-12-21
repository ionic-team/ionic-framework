import { ActionSheetOptions, AlertOptions, LoadingOptions, ModalOptions, PickerOptions, PopoverOptions } from '../interface';

import { createOverlay } from './overlays';

export function createAlert(opts: AlertOptions) {
  return createOverlay(document.createElement('ion-alert'), opts);
}

export function createActionSheet(opts: ActionSheetOptions) {
  return createOverlay(document.createElement('ion-action-sheet'), opts);
}

export function createLoading(opts: LoadingOptions) {
  return createOverlay(document.createElement('ion-loading'), opts);
}

export function createModal(opts: ModalOptions) {
  return createOverlay(document.createElement('ion-modal'), opts);
}

export function createPopover(opts: PopoverOptions) {
  return createOverlay(document.createElement('ion-popover'), opts);
}

export function createPicker(opts: PickerOptions) {
  return createOverlay(document.createElement('ion-picker'), opts);
}

export { dismissOverlay } from './overlays';

// export const alertController = {
//   // Fool stencil:
//   // document.createElement('ion-alert')
//   create(opts: AlertOptions): Promise<HTMLIonAlertElement> {
//     return createOverlay(this.doc.createElement('ion-alert'), opts);
//   }
//   dismiss(data)
// }
