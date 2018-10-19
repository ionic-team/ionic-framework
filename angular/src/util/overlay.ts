import { proxyMethod } from '../util/util';

export class OverlayBaseController<Opts, Overlay> {
  constructor(private ctrl: string) {}

  create(opts?: Opts): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'create', opts);
  }

  dismiss(data?: any, role?: string, id?: string): Promise<void> {
    return proxyMethod(this.ctrl, 'dismiss', data, role, id);
  }

  getTop(): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'getTop');
  }
}
