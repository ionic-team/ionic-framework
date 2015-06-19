//import {Router} from 'ionic/routing/router'
import {ElementRef, For, Parent} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'

import {
  Router, Routable, List, Item, HeaderTemplate, Nav, NavController,
  Toolbar, Input, Tabs,
  Tab, Content, Aside
} from 'ionic/ionic'


@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/app.html',
  directives: [Nav, List, Item, Content, HeaderTemplate, Toolbar]
})
class AppPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doLogin() {
  }
}


/**
 * Main app entry point
 */
@Component({ selector: 'ion-view' })
@View({
  directives: [Nav, Aside, List, Item, ParallaxEffect],
  templateUrl: 'main.html'
})
export default class IonicApp {
  constructor() {
    this.firstPage = AppPage

    this.menuOpenAmount = 0;


    /*
    setTimeout(() => {
      var nav = window.nav;

      var route = Router;//new Router()
      route.on('/login', (data) => {
        nav.push(LoginPage);

      })

      route.on('/post/:id', (data) => {
        console.log('ROUTE: Post page', data)
        nav.push(PostDetail, data);
      })

      route.otherwise('/login');

    }, 200);
    */
  }

  onMenuOpening(amt) {
    this.menuOpenAmount = amt;
  }
}

@Directive({
  selector: '[parallax]',
  properties: [
    'parallax'
  ]
})
export class ParallaxEffect {
  constructor(
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;

    setTimeout(() => {
      Object.observe(this, (changes) => {
        changes.forEach((change) => {
          if(change.name == 'parallax') {
            this.parallaxItems();
          }
        });
      });
    });
  }
  parallaxItems() {
    let list = this.domElement;
    console.log('Moving items', this.parallax);
    var x = Math.max(0, (1 - this.parallax) * 20);
    var y = 0;//Math.max(0, (1 - this.parallax) * 10);
    var scale = Math.min(1, (0.9 + 0.1 * this.parallax));
    list.style['opacity'] = Math.min(this.parallax, 1);
    list.style['transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
  }
}
