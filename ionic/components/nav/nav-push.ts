import {Directive} from 'angular2/angular2';
import {NavController} from './nav-controller';


@Directive({
  selector: '[nav-push]',
  properties: [
    'navPush',
    'pushData'
  ],
  host: {
    '(^click)': 'onClick($event)',
    'role': 'link'
  }
})
export class NavPush {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  onClick(event) {
    this.nav.push(this.navPush, this.pushData);
  }
}


@Directive({
  selector: '[nav-pop]',
  host: {
    '(^click)': 'onClick($event)',
    'role': 'link'
  }
})
export class NavPop {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  onClick(event) {
    this.nav.pop();
  }
}
