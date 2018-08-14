
export interface IonicGlobal {
  config?: any;
  ael?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
  raf?: (ts: number) => void;
  rel?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
  __zone_symbol__requestAnimationFrame: (ts: number) => void;
}
