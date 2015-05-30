import {DynamicComponentLoader, ComponentLaoder, ElementRef, ComponentRef, onDestroy, DomRenderer, ApplicationRef} from 'angular2/angular2';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';

class IonicAppRoot {
  constructor() {
  }

  setAppRef(appRef: ApplicationRef) {
    this.appRef = appRef;
    console.log('IonicApp: setAppRef', appRef);
  }
  getAppRef() {
    return this.appRef;
  }

  setRootElementRef(elementRef: ElementRef) {
    this.rootElementRef = elementRef;
    console.log('IonicApp: setRootElementRef', elementRef);
  }
  getRootElementRef() {
    return this.rootElementRef;
  }

  appendToRoot(Component: Type) {
    var appRef = Ionic.getAppRef();
    var injector = appRef.injector;
    var loader = injector.get(DynamicComponentLoader);
    var renderer = injector.get(DomRenderer);
    var elementRef = Ionic.getRootElementRef();

    console.log('Ionic: appendToRoot', loader, renderer, elementRef);

    var promise = new Promise(resolve => {
      return loader.loadIntoNewLocation(Component, elementRef).then((containerRef) => {
        var newEl = renderer.getHostElement(containerRef.hostView.render);

        document.body.querySelector('ion-app').appendChild(newEl);

        console.log('Injected and created', containerRef);

        resolve(containerRef.instance, containerRef.location);
      });
    });

    return promise;
  }
}

export let Ionic = new IonicAppRoot();
