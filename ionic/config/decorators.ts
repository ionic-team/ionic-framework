import {Component, Directive, View, bootstrap} from 'angular2/angular2'

import * as util from 'ionic/util';
import {ionicBindings} from './bootstrap';
import {IONIC_DIRECTIVES} from './directives';

/**
 * @private
 */
class IonicViewImpl extends View {
  constructor(args = {}) {
    args.directives = (args.directives || []).concat(IONIC_DIRECTIVES);
    super(args);
  }
}

/**
 * The IonicView decorator indicates that the decorated class is an Ionic
 * navigation view, meaning it can be navigated to using a [NavController](../../Nav/NavController/#creating_views)
 *
 * Ionic views have all [IONIC_DIRECTIVES](../IONIC_DIRECTIVES/), which include
 * all Ionic components, as well as Angular's [CORE_DIRECTIVES](https://angular.io/docs/js/latest/api/core/CORE_DIRECTIVES-const.html)
 * and [FORM_DIRECTIVES](https://angular.io/docs/js/latest/api/core/FORM_DIRECTIVES-const.html),
 * already provided to them, so you only need to supply custom directives to
 * your Ionic views:
 *
 * ```ts
 * @IonicView({
 *   template: '<ion-checkbox my-custom-dir>' +
 *             '</ion-checkbox>'
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
 *   template: `<div class="customStyle">
 *   						  <ion-checkbox></ion-checkbox>
 *   						</div>`
 * })
 * @View({
 *   directives: [IONIC_DIRECTIVES]
 * })
 * class MyCustomCheckbox {}
 *```
 * Alternatively, you could:
 * ```ts
 * import {Checkbox} from 'ionic/ionic'
 * ```
 * along with any other components and add them individually:
 * ```
 * @View({
 *   directives: [Checkbox]
 * })
 * ```
 * However, using IONIC_DIRECTIVES will always Just Work :tm: with no
 * performance overhead, so there is really no reason to not always use it.
 *
 * Ionic views are also automatically wrapped in `<ion-view>`, so although you
 * may see these tags if you inspect your markup, you don't need to include them
 * in your templates.
 *
 */
export function IonicView(args) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new IonicViewImpl(args));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

/**
 * TODO
 */
export function IonicDirective(config) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Directive(appendConfig(cls, config)));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

/**
 * TODO
 */
export function IonicComponent(config) {
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

  cls.defaultProperties = config.defaultProperties || {};

  config.properties = config.properties || [];

  for (let prop in cls.defaultProperties) {
    // add the property to the component "properties"
    config.properties.push(prop);

    // set the component "hostProperties", so the instance's
    // property value will be used to set the element's attribute
    config.host['[attr.' + util.pascalCaseToDashCase(prop) + ']'] = prop;
  }

  cls.delegates = config.delegates;

  let componentId = config.classId || (config.selector && config.selector.replace('ion-', ''));
  config.host['class'] = ((config.host['class'] || '') + ' ' + componentId).trim();

  return config;
}

/**
 * TODO
 */
export function App(args={}) {
  return function(cls) {
    // get current annotations
    let annotations = Reflect.getMetadata('annotations', cls) || [];

    // create @Component
    args.selector = args.selector || 'ion-app';
    annotations.push(new Component(args));

    // create @View
    // if no template was provided, default so it has a root ion-nav
    if (!args.templateUrl && !args.template) {
      args.template = '<ion-nav></ion-nav>';
    }

    annotations.push(new IonicViewImpl(args));

    // redefine with added annotations
    Reflect.defineMetadata('annotations', annotations, cls);

    bootstrap(cls, ionicBindings(cls, args.config));

    return cls;
  }
}
