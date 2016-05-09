import {Component, ChangeDetectionStrategy, ViewEncapsulation, Type} from 'angular2/core';

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
 * navigation component, meaning it can be navigated to using a
 * [NavController](../../nav/NavController).
 *
 * Since the app has already been bootstrapped with Ionic's core directives, it
 * is not needed to include `IONIC_DIRECTIVES` in the directives property. Additionally,
 * Angular's [CORE_DIRECTIVES](https://angular.io/docs/ts/latest/api/common/CORE_DIRECTIVES-let.html)
 * and [FORM_DIRECTIVES](https://angular.io/docs/ts/latest/api/common/FORM_DIRECTIVES-let.html),
 * are also already provided, so you only need to supply any custom components and directives
 * to your pages:
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
 * Pages have their content automatically wrapped in `<ion-page>`, so although
 * you may see these tags if you inspect your markup, you don't need to include
 * them in your templates.
 *
 * For more information on how pages are created, see the [NavController API Docs](../../components/nav/NavController/#creating_pages)
 */
export function Page(config: PageMetadata) {
  return function(cls) {
    config.selector = 'ion-page';
    config.host = config.host || {};
    config.host['[hidden]'] = '_hidden';
    config.host['[class.tab-subpage]'] = '_tabSubPage';
    var annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(config));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  };
}
