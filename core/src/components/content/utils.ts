export const ION_CONTENT_SELECTOR = 'ion-content, [ion-content]';

export const findIonContent = (el: Element): HTMLIonContentElement | null => {
  return el.querySelector(ION_CONTENT_SELECTOR) as HTMLIonContentElement;
};

export const findClosestIonContent = (el: Element): HTMLIonContentElement | null => {
  return el.closest(ION_CONTENT_SELECTOR) as HTMLIonContentElement;
};
