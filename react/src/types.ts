
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  forceUpdate(): void;
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
