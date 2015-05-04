// HACKYFILLS (hack + polyfill)
import {NgElement, ViewContainer} from 'angular2/angular2'
Object.defineProperties(NgElement.prototype, {
  domElement: {
    get: function() {
      return this._view.render.delegate.boundElements[this._boundElementIndex];
    }
  }
});

Object.defineProperties(ViewContainer.prototype, {
  domElement: {
    get: function() {
      return this.defaultProtoView.render.delegate.element;
    }
  }
});

export * from 'ionic/components'
export * from 'ionic/platform/platform'
export * from 'ionic/routing/router'
export * from 'ionic/util/focus'
export * from 'ionic/collide/animation'

export * from 'ionic/engine/engine'
export * from 'ionic/engine/cordova/cordova'
export * from 'ionic/engine/electron/electron'
