export interface RefresherEventDetail {
  complete(): void;
}

export interface RefresherCustomEvent
  extends CustomEvent {
  detail: RefresherEventDetail;
  target: HTMLIonRefresherElement;
}
