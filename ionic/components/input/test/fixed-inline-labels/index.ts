import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class PageOne {
  url;
  input1: string = 'Text 1';

  onEvent(event) {
    console.log("Did Event:", event.type);
  }
}

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = PageOne;
}
