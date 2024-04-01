export interface AccordionGroupChangeEventDetail<
  T = any
> {
  value: T;
}

export interface AccordionGroupCustomEvent<
  T = any
> extends CustomEvent {
  detail: AccordionGroupChangeEventDetail<T>;
  target: HTMLIonAccordionGroupElement;
}
