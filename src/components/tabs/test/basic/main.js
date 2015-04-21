import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {View, Tabs, Tab} from 'ionic2/components';
import {webview} from 'ionic2/webview/webview'


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [View, Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    console.log(webview.name, webview.isWebView)
  }
}



bootstrap(IonicApp)
