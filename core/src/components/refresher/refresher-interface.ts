export interface RefresherEventDetail {
  complete(): void;
}

export interface RefresherPullEndEventDetail {
  reason: 'complete' | 'cancel';
}

export interface RefresherCustomEvent extends CustomEvent {
  detail: RefresherEventDetail;
  target: HTMLIonRefresherElement;
}

export interface RefresherPullEndCustomEvent extends CustomEvent {
  detail: RefresherPullEndEventDetail;
  target: HTMLIonRefresherElement;
}
