
export interface RefresherEventDetail {
  complete(): void;
}

export interface RefresherEvent extends CustomEvent {
  target: HTMLIonRefresherElement;
  detail: RefresherEventDetail;
}
