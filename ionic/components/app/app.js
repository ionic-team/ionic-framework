import {bootstrap} from 'angular2/angular2';
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

import {ViewController} from '../view/view-controller';


@Component({
  selector: 'ionic'
})
@View({
  template: '<template pane-anchor></template>',
  directives: [PaneAnchor]
})
class IonicRootComponent extends ViewController {
  constructor(
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(null, compiler, elementRef, loader, injector);

    IonicRoot.component(this);

    if (appModules.length) {
      let appModule = appModules.shift();
      if (appModule.default) {
        this.push(appModule.default);
      }
    }
  }
}

@Directive({
  selector: 'template[pane-anchor]'
})
class PaneAnchor {
  constructor(@Parent() rootCmp: IonicRootComponent, elementRef: ElementRef, viewContainerRef: ViewContainerRef) {
    rootCmp.anchorElementRef(elementRef);
    rootCmp.anchorViewContainerRef(viewContainerRef);
  }
}

let appModules = [];

export function load(app) {
  if (app) {
    appModules.push(app);
    bootstrap(IonicRootComponent);
  }
}


class IonicAppRoot {

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param Component the ComponentType to create and insert
   * @return Promise that resolves with the ContainerRef created
   */
  append(ComponentType: Type) {
    let rootComponent = this.component();
    let injector = rootComponent.injector;
    let loader = rootComponent.loader;
    let elementRef = rootComponent.anchorElementRef();

    return new Promise((resolve, reject) => {
      rootComponent.compiler.compileInHost(ComponentType).then(componentProtoViewRef => {

        let containerRef = rootComponent.anchorViewContainerRef();
        let hostViewRef = containerRef.create(componentProtoViewRef, -1, null, injector);

        hostViewRef.elementRef = new ElementRef(hostViewRef, 0);
        hostViewRef.instance = loader._viewManager.getComponent(hostViewRef.elementRef);

        hostViewRef.dispose = () => {
          containerRef.remove( containerRef.indexOf(hostViewRef) );
        };

        resolve(hostViewRef);
      }).catch(err => {
        console.error('IonicAppRoot append:', err);
        reject(err);
      });
    });
  }

  component() {
    if (arguments.length) {
      this._cmp = arguments[0];
    }
    return this._cmp;
  }

}

export let IonicRoot = new IonicAppRoot();
