import {Directive, Optional} from 'angular2/angular2';
import {NavController} from './nav-controller';
import {NavRegistry} from './nav-registry';

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
    '(click)': 'onClick()',
    'role': 'link'
  }
})
export class NavPush {
  /**
   * TODO
   * @param {NavController} nav  TODO
   */
  constructor(@Optional() nav: NavController, registry: NavRegistry) {
    this.nav = nav;
    this.registry = registry;
    if (!nav) {
      console.error('nav-push must be within a NavController');
    }
  }

  onClick() {
    let destination, params;

    if (this.instruction instanceof Array) {
      if (this.instruction.length > 2) {
        throw 'Too many [nav-push] arguments, expects [View, { params }]'
      }
      destination = this.instruction[0];
      params = this.instruction[1] || this.params;
    } else {
      destination = this.instruction;
      params = this.params;
    }

    if (typeof destination === "string") {
      destination = this.registry.get(destination);
    }

    this.nav && this.nav.push(destination, params);
  }
}


/**
 * TODO
 */
@Directive({
  selector: '[nav-pop]',
  host: {
    '(click)': 'onClick()',
    'role': 'link'
  }
})
export class NavPop {
  /**
   * TODO
   * @param {NavController} nav  TODO
   */
  constructor(@Optional() nav: NavController) {
    this.nav = nav;
    if (!nav) {
      console.error('nav-pop must be within a NavController');
    }
  }
  onClick() {
    this.nav && this.nav.pop();
  }
}
