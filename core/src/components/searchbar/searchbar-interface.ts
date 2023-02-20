export interface SearchbarChangeEventDetail {
  value?: string | null;
}

export interface SearchbarInputEventDetail {
  value?: string | null;
  event?: Event;
}

export interface SearchbarCustomEvent extends CustomEvent {
  detail: SearchbarChangeEventDetail;
  target: HTMLIonSearchbarElement;
}
