import {App, Page} from 'ionic-angular';


@Page({template:'hi'})
class E2EPage{}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.root = E2EPage;
  }
}

document.body.innerHTML += '<link href="styles.css" rel="stylesheet">'
