
export interface QueueController {
  read: DomControllerCallback;
  write: DomControllerCallback;
}

export interface RafCallback {
  (timeStamp: number): void;
}

export interface DomControllerCallback {
  (cb: RafCallback): void;
}
