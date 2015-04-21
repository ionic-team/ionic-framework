
// platformReady: Cordova said it's ready

// domReady: DOM is ready

// ready: if cordova, it's the same as platformReady, if browser, same as dom ready

// windowLoad: All scripts have been loaded, window ready

// fullScreen

// showStatusBar

// exitApp

// is: is('ios') type of check

// platformName:  returns ios

// platformVersion: returns 8.2

// webview: returns cordova, trigger.io, browser

// isWebview:  true if its cordova, trigger. False if its browser

import * as util from 'ionic2/util'

class WebView {
  constructor(options) {
    util.extend(this, options)
  }
}

let registry = {}

class WebViewController {
  current: WebView;

  constructor() {
    let defaultProperties = {
      name: null,
      isWebView: false
    }
    for (let target in defaultProperties) {
      this.__defineGetter__(target, () => {
        return this.proxy(target, null, defaultProperties[target])
      })
    }

    let defaultMethods = {
      exitApp: util.noop,
      showStatusBar: util.noop,
      fullScreen: util.noop
    }
    for (let target in defaultMethods) {
      this[target] = () => {
        return this.proxy(target, null, defaultMethods[target])
      }
    }
  }

  get() {
    if (util.isUndefined(this.current)) {
      this.set(this.detect())
    }
    return this.current
  }

  set(webview) {
    this.current = webview
  }

  detect() {
    for (let name in registry) {
      if (registry[name].isMatch()) {
        return registry[name]
      }
    }
    return null
  }

  proxy(target, args, fallback) {
    let webview = this.get()
    if (webview && webview[target]) {
      if (util.isFunction(webview[target])) {
        return webview[target].apply(this, args)
      }
      return webview[target]
    }
    return fallback
  }

  register(webview) {
    if (!webview instanceof WebView) webview = new WebView(webview)
    registry[webview.name] = webview
  }

}

export let webview = new WebViewController()

webview.register({
  name: 'cordova',
  isMatch() {
    return true;//util.isDefined(window.cordova)
  }
})
webview.register({
  name: 'node-webkit',
  isMatch() {
    // if (util.isDefined(process) && util.isDefined(require)) {
    //   try {
    //     return util.isDefined(require('nw.gui'));
    //   } catch (e) {}
    // }
    return false
  }
})
