
export interface IonicGlobal {
  config?: any;
  ael?: (elm: any, eventName: string, cb: Function, opts: any) => void;
  raf?: Function;
  rel?: (elm: any, eventName: string, cb: Function, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
  __zone_symbol__requestAnimationFrame: Function;
}
