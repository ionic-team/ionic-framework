
export interface IonicGlobal {
  config?: any;
  asyncQueue?: boolean;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
  __zone_symbol__requestAnimationFrame?: (ts: FrameRequestCallback) => number;
}
