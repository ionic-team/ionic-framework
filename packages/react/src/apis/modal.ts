
import { ModalOptions } from '@ionic/core';

import { Delegate } from '../react-framework-delegate';
import { getOrAppendElement } from '../utils/helpers';

export function createModal(opts: ModalOptions): Promise<HTMLIonModalElement> {
  opts.delegate = Delegate;
  const element = getOrAppendElement('ion-modal-controller') as HTMLIonModalControllerElement;
  return (element as any).componentOnReady().then(() => {
    return element.create(opts);
  });
}
