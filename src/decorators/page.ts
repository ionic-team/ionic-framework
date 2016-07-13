import {Component, ChangeDetectionStrategy, ViewEncapsulation, Type} from '@angular/core';

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
 * @private
 */
export function Page(config: PageMetadata) {
  return function(cls: any) {
    // deprecated warning: added beta.8 2016-05-27
    console.warn('@Page decorator has been deprecated. Please use Angular\'s @Component instead.\nimport {Component} from \'@angular/core\';');

    config.selector = 'ion-page';
    config.host = config.host || {};
    config.host['[hidden]'] = '_hidden';
    var annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(config));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  };
}
