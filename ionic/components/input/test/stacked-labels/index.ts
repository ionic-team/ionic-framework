import {App, Page} from 'ionic-angular';


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
