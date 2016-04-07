import {Component, ChangeDetectionStrategy, ViewEncapsulation, Type} from 'angular2/core';
import {IONIC_DIRECTIVES} from '../config/directives';

const _reflect: any = Reflect;

export interface PageMetadata {
  selector?: string;
  inputs?: string[];
  outputs?: string[];
  properties?: string[];
  events?: string[];
  host?: {
      [key: string]: string;
  };
  providers?: any[];
  directives?: Array<Type | any[]>;
  pipes?: Array<Type | any[]>;
  exportAs?: string;
  queries?: {
      [key: string]: any;
  };
  template?: string;
  templateUrl?: string;
  moduleId?: string;
  styleUrls?: string[];
  styles?: string[];
  changeDetection?: ChangeDetectionStrategy;
  encapsulation?: ViewEncapsulation;
}

/**
 * @name Page
 * @description
 *
 * The Page decorator indicates that the decorated class is an Ionic
 * navigation component, meaning it can be navigated to using a NavController.
 *
 * Pages have all `IONIC_DIRECTIVES`, which include all Ionic components and directives,
 * as well as Angular's [CORE_DIRECTIVES](https://angular.io/docs/js/latest/api/core/CORE_DIRECTIVES-const.html)
 * and [FORM_DIRECTIVES](https://angular.io/docs/js/latest/api/core/FORM_DIRECTIVES-const.html),
 * already provided to them, so you only need to supply custom components and directives to your pages:
 *
 * @usage
 *
 * ```ts
 * @Page({
 *   template: `
 *    <ion-content>
 *      I am a page!
 *    </ion-content>
 *   `
 * })
 * class MyPage {}
 * ```
 *
 * Here [Content](../../../components/content/Content/) will load because
 * it is in `IONIC_DIRECTIVES`, so there is no need to add a `directives` array.
 *
 *
 * Say you built a custom component that uses the already existing Ionic component.
 * In this case, you would add `IONIC_DIRECTIVES` to your directives array.
 *
 * ```ts
 * import {IONIC_DIRECTIVES} from 'ionic-angular';
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
 *
 * ```ts
 * import {Checkbox, Icon} from 'ionic-angular'
 * ```
 *
 * along with any other components and add them individually:
 *
 * ```
 * @Component({
 *   ...
 *   directives: [Checkbox, Icon]
 * })
 * ```
 *
 * However, using IONIC_DIRECTIVES will always *Just Work* with no
 * performance overhead, so there is really no reason to not always use it.
 *
 * Pages have their content automatically wrapped in `<ion-view>`, so although
 * you may see these tags if you inspect your markup, you don't need to include
 * them in your templates.
 *
 * For more information on how pages are created, see the [NavController API reference](../../components/nav/NavController/#creating_pages)
 */
export function Page(config: PageMetadata) {
  return function(cls) {
    config.selector = 'ion-page';
    config.directives = config.directives ? config.directives.concat(IONIC_DIRECTIVES) : IONIC_DIRECTIVES;
    config.host = config.host || {};
    config.host['[hidden]'] = '_hidden';
    config.host['[class.tab-subpage]'] = '_tabSubPage';
    var annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(config));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  };
}
