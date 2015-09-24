import {Directive} from 'angular2/angular2';
import {NavController} from './nav-controller';

/**
 * TODO
 */
@Directive({
  selector: '[nav-push]',
  properties: [
    'instruction: navPush',
    'params: navParams'
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
    if (this.instruction instanceof Array) {
      if (this.instruction.length > 2) {
        throw 'Too many [nav-push] arguments, expects [View, { params }]'
      }
      this.nav.push(this.instruction[0], this.instruction[1]);
    } else {
      this.nav.push(this.instruction, this.params);
    }
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
