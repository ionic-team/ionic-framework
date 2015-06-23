import {bootstrap} from 'angular2/angular2';
import {AppViewManager} from 'angular2/src/core/compiler/view_manager';
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ComponentRef, onDestroy, DomRenderer, ApplicationRef} from 'angular2/angular2';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {bind} from 'angular2/di';
import {Injectable} from 'angular2/src/di/decorators';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {IonicConfig} from '../../config/config';
import {ViewController} from '../view/view-controller';


export class IonicApp {

  constructor() {
    this.overlays = [];
  }

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param Component the ComponentType to create and insert
   * @return Promise that resolves with the ContainerRef created
   */
  appendComponent(ComponentType: Type) {
    return new Promise((resolve, reject) => {
      let injector = this._ref.injector;
      let compiler = injector.get(Compiler);
      let viewMngr = injector.get(AppViewManager);
      let rootComponentRef = this._ref._hostComponent;
      let viewContainerLocation = rootComponentRef.location;

      compiler.compileInHost(ComponentType).then(protoViewRef => {

        let atIndex = 0;
        let context = null;

        let hostViewRef = viewMngr.createViewInContainer(
                                      viewContainerLocation,
                                      atIndex,
                                      protoViewRef,
                                      context,
                                      injector);

        hostViewRef.elementRef = new ElementRef(hostViewRef, 0);
        hostViewRef.instance = viewMngr.getComponent(hostViewRef.elementRef);

        hostViewRef.dispose = () => {
          viewMngr.destroyViewInContainer(viewContainerLocation, 0, 0, hostViewRef.viewRef);
        };

        resolve(hostViewRef);

      }).catch(err => {
        console.error('IonicApp appendComponent:', err);
        reject(err);
      });
    });
  }

  ref() {
    if (arguments.length) {
      this._ref = arguments[0];
    }
    return this._ref;
  }

}

export function ionicBootstrap(ComponentType, config) {
  return new Promise((resolve, reject) => {
    let app = new IonicApp();
    config = config || new IonicConfig();

    let componentInjectableBindings = [
      bind(IonicApp).toValue(app),
      bind(IonicConfig).toValue(config)
    ];

    bootstrap(ComponentType, componentInjectableBindings).then(appRef => {
      app.ref(appRef);
      resolve(app);

    }).catch(err => {
      console.error('ionicBootstrap', err);
      reject(err);
    });

  });
}

export function load(app) {
  if (!app) {
    console.error('Invalid app module');

  } else if (!app.main) {
    console.error('App module missing main()');

  } else {
    app.main(ionicBootstrap);
  }
}
