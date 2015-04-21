import {bootstrap} from 'angular2/core'
import {Component, Template} from 'angular2/angular2'
import {View, Tabs, Tab} from 'ionic2/components'
import {webview} from 'ionic2/webview/webview'
import {cordova} from 'ionic2/webview/cordova/cordova'
import {nodeWebkit} from 'ionic2/webview/node-webkit/node-webkit'
import * as util from 'ionic2/util'


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [View, Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    console.log(webview.getName(), webview.is('cordova'))

    webview.ready().then(() => {
      console.log('webviewready')
    })

    webview.fullScreen(true).then((isShown) => {
      console.log('fullScreen', isShown)
    })

    webview.showStatusBar(true).then((isShown) => {
      console.log('showStatusBar', isShown)
    })

  }
}

bootstrap(IonicApp)
