// HACKYFILLS (hack + polyfill)
import {NgElement, ViewContainerRef} from 'angular2/angular2'

//import {DomRenderedElement} from 'ionic/util/render/dom';

/*
Object.defineProperties(NgElement.prototype, {
  renderElement: {
    get: function() {
      return new DomRenderedElement(this._view.render.delegate.boundElements[this._boundElementIndex]);
    }
  },
  domElement: {
    get: function() {
      console.log('GETTING DOM ELEMENT');
      return this._view.render.delegate.boundElements[this._boundElementIndex];
    }
  }
});
*/


Object.defineProperties(ViewContainerRef.prototype, {
  domElement: {
    get: function() {
      return this._defaultProtoView.render.delegate.element;
    }
  }
});


export * from 'ionic/components'
export * from 'ionic/directives'
export * from 'ionic/platform/platform'
export * from 'ionic/routing/router'

export * from 'ionic/util/click-block'
export * from 'ionic/util/focus'

export * from 'ionic/engine/engine'
export * from 'ionic/engine/cordova/cordova'
export * from 'ionic/engine/electron/electron'

export * from 'ionic/animations/animation'
export * from 'ionic/transitions/transition'
export * from 'ionic/transitions/none-transition'
export * from 'ionic/transitions/ios-transition'
