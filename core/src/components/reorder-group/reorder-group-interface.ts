
export interface ItemReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}

export interface ItemReorderCustomEvent extends CustomEvent {
  target: HTMLIonReorderGroupElement;
  detail: ItemReorderEventDetail;
}
