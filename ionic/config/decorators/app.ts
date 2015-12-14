import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {TapClick} from '../../components/tap-click/tap-click';
import {ionicProviders} from '../bootstrap';
import {IONIC_DIRECTIVES} from '../directives';

/**
* @name App
* @description
* App is an Ionic decorator that bootstraps an application. It can be passed a number of arguments, that act as global config variables for the app.
* App can accept a `template` property that has an inline template or a `templateUrl` property that points to an external html template.
*
* @usage
* ```ts
* import {App} from 'ionic/ionic';
*
* @App({
*   templateUrl: 'app/app.html'
* })
*
* export class MyApp{
*   // Anything we would want to do at the root of our app
* }
* ```
*
* @param {Object} [config] - the app's [../Config](Config) object
* @param {String} [template] - the template to use for the app root
* @param {String} [templateUrl] - a relative URL pointing to the template to use for the app root
*
*/
export function App(args={}) {

  return function(cls) {
    // get current annotations
    let annotations = Reflect.getMetadata('annotations', cls) || [];

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
    Reflect.defineMetadata('annotations', annotations, cls);

    bootstrap(cls, ionicProviders(args)).then(appRef => {
      appRef.injector.get(TapClick);
    });

    return cls;
  }
}
