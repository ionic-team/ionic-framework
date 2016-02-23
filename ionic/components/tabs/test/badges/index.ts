import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  myBadge:number = 55;

  constructor() {}
}

document.body.innerHTML += '<link href="styles.css" rel="stylesheet">'
