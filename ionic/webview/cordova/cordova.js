import {webview} from '../webview'

webview.register({
  name: 'cordova',
  isMatch() {
    return !(!window.cordova && !window.PhoneGap && !window.phonegap)
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
  showStatusBar(shouldShow) {
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
