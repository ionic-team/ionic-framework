import {bootstrap} from 'angular2/core';
import {Component, Template, NgElement, Parent} from 'angular2/angular2';
import {NavView} from 'ionic2/components/nav-view/nav-view';
import {View} from 'ionic2/components/view/view';
import {Log} from 'ionic2/util';

@Component({
  selector: 'my-page',
})
@Template({
  inline: "<div><h2>I'm a page!</h2><content></content></div>"
})
export class MyPage extends View {
  constructor(@NgElement() ele:NgElement, @Parent() nav: NavView) {
    Log.log('Page constructed!', ele, nav)
    super(ele, nav)
  }
}


@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavView, View, MyPage],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
