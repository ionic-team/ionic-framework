import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {View, Tabs, Tab} from 'ionic/components'
import {webview} from 'ionic/webview/webview'
import {cordova} from 'ionic/webview/cordova/cordova'
import {nodeWebkit} from 'ionic/webview/node-webkit/node-webkit'
import * as util from 'ionic/util'


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
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
