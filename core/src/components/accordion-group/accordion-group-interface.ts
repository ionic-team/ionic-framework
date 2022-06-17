export interface AccordionGroupChangeEventDetail<T = any> {
  value: T;
}

/**
 * @deprecated
 * Use `IonAccordionGroupCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface AccordionGroupCustomEvent<T = any> extends CustomEvent {
  detail: AccordionGroupChangeEventDetail<T>;
  target: HTMLIonAccordionGroupElement;
}
