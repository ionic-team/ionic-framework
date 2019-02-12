import { proxyMethod } from './util';

export class OverlayBaseController<Opts, Overlay> {
  constructor(private ctrl: string) {}

  /**
   * Creates a new overlay
   */
  create(opts?: Opts): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'create', opts);
  }

  /**
   * When `id` is not provided, it dismisses the top overlay.
   */
  dismiss(data?: any, role?: string, id?: string): Promise<void> {
    return proxyMethod(this.ctrl, 'dismiss', data, role, id);
  }

  /**
   * Returns the top overlay.
   */
  getTop(): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'getTop');
  }
}
