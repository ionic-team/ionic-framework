export interface AccordionGroupChangeEventDetail<T = any> {
  value: T;
  initial?: boolean;
}

export interface AccordionGroupCustomEvent<T = any> extends CustomEvent {
  detail: AccordionGroupChangeEventDetail<T>;
  target: HTMLIonAccordionGroupElement;
}
