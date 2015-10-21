import {NavController, NavParams} from 'ionic/ionic';
import {Page, Events} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';

@Page({
  templateUrl: 'navigation/navigation-details.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
class NavigationDetailsPage {
  constructor(nav: NavController, params: NavParams, events: Events) {
    this.nav = nav;
    this.selection = { title: params.data.name };
    var navData = {
        'Angular': "A powerful Javascript framework for building single page apps. Angular is open source, and maintained by Google.",
        'CSS3': "The latest version of cascading stylesheets - the styling language of the web!",
        'HTML5': "The latest version of the web's markup language.",
        'Sass': "Syntactically Awesome Stylesheets - a mature, stable, and powerful professional grade CSS extension."
    };
    var navIcons = {
        'Angular': 'ion-social-angular',
        'CSS3': 'ion-social-css3',
        'HTML5': 'ion-social-html5',
        'Sass': 'ion-social-sass'
    };
    this.selection['content'] = navData[this.selection.title];
    this.selection['icon'] = navIcons[this.selection.title];
  }
}

@Page({
    templateUrl: 'navigation/navigation.html',
    directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class NavigationPage {

  constructor(nav: NavController) {
      this.nav = nav;
  }

  openNavDetailsPage(item) {
    this.nav.push(NavigationDetailsPage, { name: item });
  }

}
