import {Directive} from 'angular2/angular2';
import {NavController} from './nav-controller';

/**
 * TODO
 */
@Directive({
  selector: '[nav-push]',
  properties: [
    'navInstructions: navPush'
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

  set navInstructions(instructions) {
    if (instructions instanceof Array) {
      if (instructions.length > 2) {
        throw 'Too many [nav-push] arguments, expects [View, { params }]'
      }
      this.destination = instructions[0];
      this.navParams = instructions[1];
    } else {
      this.destination = instructions;
    }

    //let annotations = Reflect.getMetadata('annotations', view);
    // TODO check to make sure destination is a Component/IonicView?
  }

  onClick(event) {
    this.nav.push(this.destination, this.navParams);
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
