
export interface GestureDetail {
  type: string;
  startX: number;
  startY: number;
  startTimeStamp: number;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  deltaX: number;
  deltaY: number;
  timeStamp: number;
  event: UIEvent;
  data?: any;
}

export interface GestureCallback {
  (detail?: GestureDetail): boolean|void;
}
