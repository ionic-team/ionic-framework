
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface OverlayComponentElement extends HTMLStencilElement {
  'present': () => Promise<void>;
  'dismiss': (data?: any, role?: string | undefined) => Promise<boolean>;
}

export interface OverlayControllerComponentElement<E extends OverlayComponentElement> extends HTMLStencilElement {
  'create': (opts: any) => Promise<E>;
}

export interface IonicGlobal {
  config?: any;
  ael?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
  raf?: (ts: number) => void;
  rel?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
}
