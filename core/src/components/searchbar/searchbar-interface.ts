export interface SearchbarChangeEventDetail {
  value?: string | null;
}

export interface SearchbarCustomEvent extends CustomEvent {
  detail: SearchbarChangeEventDetail;
  target: HTMLIonSearchbarElement;
}
