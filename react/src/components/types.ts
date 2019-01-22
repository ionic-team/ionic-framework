
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface OverlayComponentElement extends HTMLStencilElement {
  'present': () => Promise<void>;
  'dismiss': (data?: any, role?: string | undefined) => Promise<boolean>;
}
export interface OverlayControllerComponentElement<E extends OverlayComponentElement> extends HTMLStencilElement {
  'create': (opts: any) => Promise<E>;
}
