// TODO(FW-6590): Remove this once the deprecated event is removed
export interface ItemReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}

// TODO(FW-6590): Remove this once the deprecated event is removed
export interface ItemReorderCustomEvent extends CustomEvent {
  detail: ItemReorderEventDetail;
  target: HTMLIonReorderGroupElement;
}

export interface ReorderMoveEventDetail {
  from: number;
  to: number;
}

export interface ReorderEndEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}

export interface ReorderMoveCustomEvent extends CustomEvent {
  detail: ReorderMoveEventDetail;
  target: HTMLIonReorderGroupElement;
}

export interface ReorderEndCustomEvent extends CustomEvent {
  detail: ReorderEndEventDetail;
  target: HTMLIonReorderGroupElement;
}
