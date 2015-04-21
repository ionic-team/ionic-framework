import {webview} from '../webview'

webview.register({
  name: 'node-webkit',
  isMatch() {
    try {
      return util.isDefined(process) && util.isDefined(require) && util.isDefined(require('nw.gui'))
    } catch (e) {}
    return false
  },
  ready() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  },
  fullScreen(shouldShow) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(shouldShow)
      }, 1000)
    })
  },
  exitApp() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  }
})
