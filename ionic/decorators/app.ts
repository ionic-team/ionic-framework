import {Component, ChangeDetectionStrategy, ViewEncapsulation, enableProdMode, Type} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {IonicApp} from '../components/app/app';
import {TapClick} from '../components/tap-click/tap-click';
import {ionicProviders} from '../config/bootstrap';
import {IONIC_DIRECTIVES} from '../config/directives';

const _reflect: any = Reflect;

export interface AppMetadata {
  prodMode?: boolean;
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
  config?: any;
}

/**
* @name App
* @description
* App is an Ionic decorator that bootstraps an application. It can be passed a
* number of arguments that act as global config variables for the app.
* `@App` is similar to Angular's `@Component` in which it can accept a `template`
* property that has an inline template, or a `templateUrl` property that points
* to an external html template.
*
* @usage
* ```ts
* import {App} from 'ionic-angular';
*
* @App({
*   templateUrl: 'app/app.html',
*   providers: [DataService]
* })
*
* export class MyApp{
*   // Anything we would want to do at the root of our app
* }
* ```
*
* @property {object} [config] - the app's {@link /docs/v2/api/config/Config/ Config} object.
* @property {boolean} [prodMode] - Enable Angular's production mode, which turns off assertions and other checks within the framework. Additionally, this config sets the return value of `isProd()` which is on the `IonicApp` instance. Defaults to `false`.
* @property {array}  [pipes] - any pipes for your app.
* @property {array}  [providers] - any providers for your app.
* @property {string} [template] - the template to use for the app root.
* @property {string} [templateUrl] - a relative URL pointing to the template to use for the app root.
*/
export function App(args: AppMetadata = {}) {

  return function(cls) {
    // get current annotations
    let annotations = _reflect.getMetadata('annotations', cls) || [];

    args.selector = 'ion-app';

    // auto add Ionic directives
    args.directives = args.directives ? args.directives.concat(IONIC_DIRECTIVES) : IONIC_DIRECTIVES;

    // if no template was provided, default so it has a root <ion-nav>
    if (!args.templateUrl && !args.template) {
      args.template = '<ion-nav></ion-nav>';
    }

    // create @Component
    annotations.push(new Component(args));

    // redefine with added annotations
    _reflect.defineMetadata('annotations', annotations, cls);

    // define array of bootstrap providers
    let providers = ionicProviders(args).concat(args.providers || []);

    if (args.prodMode) {
      enableProdMode();
    }

    bootstrap(cls, providers).then(appRef => {
      appRef.injector.get(TapClick);
      let app: IonicApp = appRef.injector.get(IonicApp);
      app.setProd(args.prodMode);
    });

    return cls;
  };
}
