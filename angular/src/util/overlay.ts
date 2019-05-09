import { proxyMethod } from './util';

export class OverlayBaseController<Opts, Overlay> {
  constructor(private ctrl: string, private doc: Document) {}

  /**
   * Creates a new overlay
   */
  create(opts?: Opts): Promise<Overlay> {
    return proxyMethod(this.ctrl, this.doc, 'create', opts);
  }

  /**
   * When `id` is not provided, it dismisses the top overlay.
   */
  dismiss(data?: any, role?: string, id?: string): Promise<void> {
    return proxyMethod(this.ctrl, this.doc, 'dismiss', data, role, id);
  }

  /**
   * Returns the top overlay.
   */
  getTop(): Promise<Overlay | undefined> {
    return proxyMethod(this.ctrl, this.doc, 'getTop');
  }
}
