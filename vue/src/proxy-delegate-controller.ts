import ProxyController from './proxy-controller';
import { FrameworkDelegate, ProxyDelegateOptions } from './interfaces';

// A proxy class that allows early access to controller methods
export default class ProxyDelegateController extends ProxyController {
  static delegate: FrameworkDelegate;

  constructor(public tag: string, delegate: FrameworkDelegate) {
    super(tag);

    if (!ProxyDelegateController.delegate) {
      ProxyDelegateController.delegate = delegate;
    }
  }

  create(opts: ProxyDelegateOptions = {} as ProxyDelegateOptions) {
    opts.delegate = ProxyDelegateController.delegate;
    return super.create(opts);
  }
}
