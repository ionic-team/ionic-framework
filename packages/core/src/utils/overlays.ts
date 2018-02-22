
export const BACKDROP = 'backdrop';

export interface OverlayInterface {
  overlayId: number;

  present(): Promise<void>;
  dismiss(data?: any, role?: string): Promise<void>;
}

export interface HTMLIonOverlayElement extends HTMLStencilElement, OverlayInterface {}

export type OverlayMap = Map<number, HTMLIonOverlayElement>;

let lastId = 1;

export function createOverlay<T extends HTMLIonOverlayElement>
(tagName: string, opts: any): Promise<T> {
  // create ionic's wrapping ion-alert component
  const element = document.createElement(tagName) as T;

  // give this alert a unique id
  element.overlayId = lastId++;

  // convert the passed in alert options into props
  // that get passed down into the new alert
  Object.assign(element, opts);

  // append the alert element to the document body
  const appRoot = document.querySelector('ion-app') || document.body;
  appRoot.appendChild(element);

  return element.componentOnReady();
}

export function dismissOverlay(data: any, role: any, overlays: OverlayMap, id: number): Promise<void> {
  id = id >= 0 ? id : getHighestId(overlays);
  const overlay = overlays.get(id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
}

export function getTopOverlay(overlays: Map<number, any>) {
  return overlays.get(getHighestId(overlays));
}

export function getHighestId(overlays: Map<number, any>) {
  let minimum = -1;
  overlays.forEach((_, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

export function removeLastOverlay(overlays: OverlayMap) {
  const toRemove = getTopOverlay(overlays);
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}
