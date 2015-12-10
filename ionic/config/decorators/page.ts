import {Component} from 'angular2/core'
import {IONIC_DIRECTIVES} from '../directives';


/**
 * _For more information on how pages are created, see the [NavController API
 * reference](../../components/nav/NavController/#creating_pages)._
 *
 * The Page decorator indicates that the decorated class is an Ionic
 * navigation component, meaning it can be navigated to using a NavController.
 *
 * Pages have all [IONIC_DIRECTIVES](../IONIC_DIRECTIVES/), which include
 * all Ionic components and directives, as well as Angular's [CORE_DIRECTIVES](https://angular.io/docs/js/latest/api/core/CORE_DIRECTIVES-const.html)
 * and [FORM_DIRECTIVES](https://angular.io/docs/js/latest/api/core/FORM_DIRECTIVES-const.html),
 * already provided to them, so you only need to supply custom components and
 * directives to your pages:
 *
 * ```ts
 * @Page({
 *   template: `
 *     <ion-checkbox my-custom-dir>
 *     </ion-checkbox>`
 *   directives: [MyCustomDirective]
 * })
 * class MyPage {}
 * ```
 * Here [Checkbox](../../../components/checkbox/Checkbox/) will load because
 * it is in IONIC_DIRECTIVES, so there is no need to add it to the `directives`
 * array.
 *
 * For custom components that use Ionic components, you will need to include
 * IONIC_DIRECTIVES in the `directives` array:
 *
 * ```ts
 * import {IONIC_DIRECTIVES} from 'ionic/ionic';
 * @Component({
 *   selector: 'my-component'
 *   template: `<div class="my-style">
 *   						  <ion-checkbox></ion-checkbox>
 *   						</div>`,
 *   directives: [IONIC_DIRECTIVES]
 * })
 * class MyCustomCheckbox {}
 *```
 * Alternatively, you could:
 * ```ts
 * import {Checkbox, Icon} from 'ionic/ionic'
 * ```
 * along with any other components and add them individually:
 * ```
 * @Component({
 *   ...
 *   directives: [Checkbox, Icon]
 * })
 * ```
 * However, using IONIC_DIRECTIVES will always *Just Work* with no
 * performance overhead, so there is really no reason to not always use it.
 *
 * Pages have their content automatically wrapped in `<ion-view>`, so although
 * you may see these tags if you inspect your markup, you don't need to include
 * them in your templates.
 */
export function Page(config={}) {
  return function(cls) {
    config.selector = 'ion-page';
    config.directives = config.directives ? config.directives.concat(IONIC_DIRECTIVES) : IONIC_DIRECTIVES;
    config.host = config.host || {};
    config.host['[hidden]'] = '_hidden';
    config.host['[class.tab-subpage]'] = '_tabSubPage';
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(config));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}
