export interface SearchbarChangeEventDetail {
  value?: string | null;
  event?: Event;
}

export interface SearchbarInputEventDetail {
  value?: string | null;
  event?: Event;
}

export interface SearchbarCustomEvent extends CustomEvent {
  detail: SearchbarChangeEventDetail;
  target: HTMLIonSearchbarElement;
}
