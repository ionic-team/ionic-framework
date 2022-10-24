export interface SearchbarChangeEventDetail {
  value?: string;
}

export interface SearchbarCustomEvent extends CustomEvent {
  detail: SearchbarChangeEventDetail;
  target: HTMLIonSearchbarElement;
}
