import {App, IonicApp, Page, Platform} from 'ionic/ionic';


@App({
  templateUrl: 'app.html'
})
class ApiDemoApp {

    constructor(app: IonicApp, platform: Platform) {
      this.app = app;
      this.platform = platform;
      this.rootPage = PageOne;
      this.pages = [
        { title: 'Basic List', component: PageOne },
        { title: 'Inset List', component: PageTwo },
        { title: 'No-lines List', component: PageThree },
        { title: 'List Headers', component: PageFour },
        { title: 'Sliding Items', component: PageFive },


      ];

    }

    openPage(page) {
      this.app.getComponent('leftMenu').close();
      let nav = this.app.getComponent('nav');
      nav.setRoot(page.component);
    }

}

@Page({
  templateUrl: 'basic-list.html',
})
export class PageOne{
  constructor() {
  }
}

@Page({
  templateUrl: 'inset-list.html',
})
export class PageTwo {
  constructor() {
  }
}

@Page({
  templateUrl: 'no-lines-list.html',
})
export class PageThree {
  constructor() {
  }
}

@Page({
  templateUrl: 'list-headers.html',
})
export class PageFour {
  constructor() {
  }
}

@Page({
  templateUrl: 'sliding-items.html',
})
export class PageFive {
  constructor() {
  }
}
