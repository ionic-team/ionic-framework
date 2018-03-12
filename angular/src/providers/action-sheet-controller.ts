import { Injectable } from '@angular/core';
import { ActionSheetDismissEvent, ActionSheetOptions } from '@ionic/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let actionSheetId = 0;

@Injectable()
export class ActionSheetController {
  create(opts?: ActionSheetOptions): ActionSheetProxy {
    return getActionSheetProxy(opts);
  }
}

export function getActionSheetProxy(opts: ActionSheetOptions) {
  return {
    id: actionSheetId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this); },
    dismiss: function() { return dismiss(this); },
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as ActionSheetProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as ActionSheetProxyInternal).onWillDismissHandler = callback;
    },
  };
}

export function present(actionSheetProxy: ActionSheetProxyInternal): Promise<any> {
  actionSheetProxy.state = PRESENTING;
  return loadOverlay(actionSheetProxy.opts).then((actionSheetElement: HTMLIonActionSheetElement) => {
    actionSheetProxy.element = actionSheetElement;

    const onDidDismissHandler = (event: ActionSheetDismissEvent) => {
      actionSheetElement.removeEventListener(ION_ACTION_SHEET_DID_DISMISS_EVENT, onDidDismissHandler);
      if (actionSheetProxy.onDidDismissHandler) {
        actionSheetProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: ActionSheetDismissEvent) => {
      actionSheetElement.removeEventListener(ION_ACTION_SHEET_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (actionSheetProxy.onWillDismissHandler) {
        actionSheetProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    actionSheetElement.addEventListener(ION_ACTION_SHEET_DID_DISMISS_EVENT, onDidDismissHandler);
    actionSheetElement.addEventListener(ION_ACTION_SHEET_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (actionSheetProxy.state === PRESENTING) {
      return actionSheetElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(actionSheetProxy: ActionSheetProxyInternal): Promise<any> {
  actionSheetProxy.state = DISMISSING;
  if (actionSheetProxy.element) {
    if (actionSheetProxy.state === DISMISSING) {
      return actionSheetProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
  const element = ensureElementInBody('ion-action-sheet-controller') as HTMLIonActionSheetControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface ActionSheetProxy {
  present(): Promise<void>;
  dismiss(): Promise<void>;
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface ActionSheetProxyInternal extends ActionSheetProxy {
  id: number;
  opts: ActionSheetOptions;
  state: number;
  element: HTMLIonActionSheetElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_ACTION_SHEET_DID_DISMISS_EVENT = 'ionActionSheetDidDismiss';
const ION_ACTION_SHEET_WILL_DISMISS_EVENT = 'ionActionSheetWillDismiss';
