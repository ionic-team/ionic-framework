import {App, Page} from '../../../../../src';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = PageOne;
}

@Page({
  templateUrl: 'main.html'
})
class PageOne {}
