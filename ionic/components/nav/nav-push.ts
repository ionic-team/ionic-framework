import {Directive} from 'angular2/angular2';
import {NavController} from './nav-controller';

/**
 * TODO
 */
@Directive({
  selector: '[nav-push]',
  properties: [
    'navPush',
    'pushData'
  ],
  host: {
    '(click)': 'onClick($event)',
    'role': 'link'
  }
})
export class NavPush {
  /**
   * TODO
   * @param {NavController} nav  TODO
   */
  constructor(nav: NavController) {
    this.nav = nav;
  }

  onClick(event) {
    this.nav.push(this.navPush, this.pushData);
  }
}

/**
 * TODO
 */
@Directive({
  selector: '[nav-pop]',
  host: {
    '(click)': 'onClick($event)',
    'role': 'link'
  }
})
export class NavPop {
  /**
   * TODO
   * @param {NavController} nav  TODO
   */
  constructor(nav: NavController) {
    this.nav = nav;
  }
  onClick(event) {
    this.nav.pop();
  }
}
