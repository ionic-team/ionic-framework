
import { ModalOptions } from '@ionic/core';

import { Delegate } from '../react-framework-delegate';
import { getOrAppendElement } from '../utils/helpers';

export function createModal(opts: ModalOptions): Promise<HTMLIonModalElement> {
  return createOverlayInternal('ion-modal-controller', opts);
}

export function createPopover(opts: ModalOptions): Promise<HTMLIonModalElement> {
  return createOverlayInternal('ion-popover-controller', opts);
}


function createOverlayInternal(controllerTagName: string, opts: any) {
  opts.delegate = Delegate;
  const element = getOrAppendElement(controllerTagName) as HTMLIonModalControllerElement;
  return (element as any).componentOnReady().then(() => {
    return element.create(opts);
  });
}