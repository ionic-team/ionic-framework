import {Component, Directive, View, bootstrap} from 'angular2/angular2'

import * as util from 'ionic/util';
import {ionicProviders} from './bootstrap';
import {IONIC_DIRECTIVES} from './directives';

/**
 * @private
 */
class PageImpl extends View {
  constructor(args = {}) {
    args.directives = (args.directives || []).concat(IONIC_DIRECTIVES);
    super(args);
  }
}

/**
 * _For more information on how pages are created, see the [NavController API
 * reference](../../Nav/NavController/#creating_pages)._
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
export function Page(args) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new PageImpl(args));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

/**
 * TODO
 */
export function ConfigComponent(config) {
  return function(cls) {
    return makeComponent(cls, appendConfig(cls, config));
  }
}

export function makeComponent(cls, config) {
  var annotations = Reflect.getMetadata('annotations', cls) || [];
  annotations.push(new Component(config));
  Reflect.defineMetadata('annotations', annotations, cls);
  return cls;
}

function appendConfig(cls, config) {
  config.host = config.host || {};

  cls.defaultInputs = config.defaultInputs || {};

  config.inputs = config.inputs || [];

  for (let prop in cls.defaultInputs) {
    // add the property to the component "inputs"
    config.inputs.push(prop);

    // set the component "hostProperties", so the instance's
    // input value will be used to set the element's attribute
    config.host['[attr.' + util.pascalCaseToDashCase(prop) + ']'] = prop;
  }

  cls.delegates = config.delegates;

  return config;
}

/**
 * TODO
 */
export function App(args={}) {
  return function(cls) {
    // get current annotations
    let annotations = Reflect.getMetadata('annotations', cls) || [];

    // default to select <ion-app>
    args.selector = args.selector || 'ion-app';

    // auto add Ionic directives
    args.directives = args.directives ? args.directives.concat(IONIC_DIRECTIVES) : IONIC_DIRECTIVES;

    // if no template was provided, default so it has a root <ion-nav>
    if (!args.templateUrl && !args.template) {
      args.template = '<ion-nav></ion-nav>';
    }

    // create @Component
    annotations.push(new Component(args));

    // redefine with added annotations
    Reflect.defineMetadata('annotations', annotations, cls);

    bootstrap(cls, ionicProviders(args.config));

    return cls;
  }
}
