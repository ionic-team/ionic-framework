
export interface RefresherEventDetail {
  complete(): void;
}

export interface RefresherCustomEvent extends CustomEvent {
  target: HTMLIonRefresherElement;
  detail: RefresherEventDetail;
}
