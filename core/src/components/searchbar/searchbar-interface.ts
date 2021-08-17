
export interface SearchbarChangeEventDetail {
  value: string | undefined;
}

export interface SearchbarCustomEvent extends CustomEvent {
  target: HTMLIonSearchbarElement;
  detail: SearchbarChangeEventDetail;
}
