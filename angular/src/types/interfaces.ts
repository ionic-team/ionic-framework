export interface IonicGlobal {
  config?: any; // TODO(FW-2827): type
  asyncQueue?: boolean;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
  __zone_symbol__requestAnimationFrame?: (ts: FrameRequestCallback) => number;
}

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady?(): Promise<this>;
  forceUpdate?(): void;
}
