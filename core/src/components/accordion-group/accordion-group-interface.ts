export interface AccordionGroupChangeEventDetail<T = any> {
  value: T;
}

export interface AccordionGroupEvent<T = any> extends CustomEvent {
  detail: AccordionGroupChangeEventDetail<T>;
  target: HTMLIonAccordionGroupElement;
}
