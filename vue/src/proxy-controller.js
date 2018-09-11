import * as apiUtils from './api-utils'

// A proxy class that allows early access to controller methods
export default class ProxyController {
  constructor(tag) {
    this.tag = tag
  }

  create(opts = {}) {
    return apiUtils.proxyMethod(this.tag, 'create', opts)
  }

  dismiss() {
    return apiUtils.proxyMethod(this.tag, 'dismiss')
  }

  getTop() {
    return apiUtils.proxyMethod(this.tag, 'getTop')
  }
}
