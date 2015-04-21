
import * as util from 'ionic2/util'

class WebView {
  constructor(options) {
    util.extend(this, options)
  }
}

let registry = {}
let defaultWebView;
let activeWebView;

class WebViewController {

  constructor() {
    let self = this
    let proxyMethods = 'ready fullScreen showStatusBar exitApp'.split(' ')
    for (let x = 0; x < proxyMethods.length; x++) {
      this[proxyMethods[x]] = function() {
        return self.proxy(proxyMethods[x], arguments)
      }
    }
  }

  proxy(target, args) {
    let webview = this.get()
    if (webview && webview[target]) {
      return webview[target].apply(this, args)
    }
    return new Promise(resolve => {}, reject => {
      reject()
    })
  }

  is(name) {
    return this.getName() === name
  }

  isWebView() {
    return !!this.get().isWebView
  }

  getName() {
    return this.get().name
  }

  get() {
    if (util.isUndefined(activeWebView)) {
      this.set(this.detect())
    }
    return activeWebView || defaultWebView
  }

  set(webview) {
    activeWebView = webview
  }

  setDefault(webview) {
    if (!webview instanceof WebView) webview = new WebView(webview)
    defaultWebView = webview
  }

  register(webview) {
    if (!webview instanceof WebView) webview = new WebView(webview)
    webview.isWebView = true
    registry[webview.name] = webview
  }

  detect() {
    for (let name in registry) {
      if (registry[name].isMatch()) {
        return registry[name]
      }
    }
    return null
  }

}

export let webview = new WebViewController()


webview.setDefault({
  name: 'default',
  ready: util.dom.windowLoad
})


