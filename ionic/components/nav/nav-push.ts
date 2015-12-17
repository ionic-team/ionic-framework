import {Directive, Optional} from 'angular2/core';
import {NavController} from './nav-controller';
import {NavRegistry} from './nav-registry';

/**
 * @name NavPush
 * @description
 * Directive for declaratively linking to a new page instead of using
 * {@link ../NavController/#push NavController.push}. Similar to ui-router's `ui-sref`.
 *
 * @usage
 * ```html
 * <button [navPush]="pushPage"></button>
 * ```
 * To specify parameters you can use array syntax or the `nav-params` property:
 * ```html
 * <button [navPush]="pushPage" [navParams]="params"></button>
 * ```
 * Where `pushPage` and `params` are specified in your component, and `pushPage`
 * contains a reference to a [@Page component](../../../config/Page/):
 *
 * ```ts
 * import {LoginPage} from 'login';
 * @Page({
 *   template: `<button [navPush]="pushPage" [navParams]="params"></button>`
 * })
 * class MyPage {
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * ### Alternate syntax
 * You can also use syntax similar to Angular2's router, passing an array to
 * NavPush:
 * ```html
 * <button [navPush]="[pushPage, params]"></button>
 * ```
 * @demo /docs/v2/demos/nav-push-pop/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPop NavPop API Docs}
 */
@Directive({
  selector: '[navPush]',
  inputs: [
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

  /**
   * @private
   */
  onClick() {
    let destination, params;

    if (this.instruction instanceof Array) {
      if (this.instruction.length > 2) {
        throw 'Too many [navPush] arguments, expects [View, { params }]'
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
 * @name NavPop
 * @description
 * Directive for declaratively pop the current page off from the navigation stack.
 *
 * @usage
 * ```html
 * <ion-content>
 *  <div block button nav-pop>go back</div>
 * </ion-content>
 * ```
 * This will go back one page in the navigation stack
 *
 * Similar to {@link /docs/v2/api/components/nav/NavPush/ `NavPush` }
 * @demo /docs/v2/demos/nav-push-pop/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPush NavPush API Docs}
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
  /**
   * @private
   */
  onClick() {
    this.nav && this.nav.pop();
  }
}
