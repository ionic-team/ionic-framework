
export interface ItemReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}

export interface ItemReorderEvent extends CustomEvent {
  target: HTMLIonReorderGroupElement;
  detail: ItemReorderEventDetail;
}
