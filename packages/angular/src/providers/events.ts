import { Injectable } from '@angular/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let hydratedElement: HTMLIonEventsElement = null;

@Injectable()
export class Events {

  publish(topic: string, event?: any): Promise<any> {
    return getElement().then((element: HTMLIonEventsElement) => {
      return element.publish(topic, event);
    });
  }

  subscribe(topic: string, handler: (event?: any) => void) {
    return getElement().then((element: HTMLIonEventsElement) => {
      return element.subscribe(topic, handler);
    });
  }
}
function getElement(): Promise<HTMLIonEventsElement> {
  if (hydratedElement) {
    return Promise.resolve(hydratedElement);
  }
  const element = ensureElementInBody(ELEMENT_NAME);
  return hydrateElement(element).then((element: HTMLIonEventsElement) => {
    hydratedElement = element;
    return element;
  });
}

const ELEMENT_NAME = 'ion-events';
