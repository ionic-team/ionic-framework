import ProxyController from './proxy-controller'

// A proxy class that allows early access to controller methods
export default class ProxyDelegateController extends ProxyController {
  constructor(tag, delegate) {
    super(tag)

    if (!ProxyDelegateController.delegate) {
      ProxyDelegateController.delegate = delegate
    }
  }

  create(opts = {}) {
    opts.delegate = ProxyDelegateController.delegate
    return super.create(opts)
  }
}
