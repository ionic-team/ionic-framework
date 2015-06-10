import {Component} from 'angular2/src/core/annotations_impl/annotations';

import * as util from 'ionic/util'
import {dom} from 'ionic/util'
import {Platform} from 'ionic/platform/platform'

let platformMode = Platform.getMode();

// Low-level: how the user will override
// BackButton.config.bind.icon.value = 'ion-chevron-right'
// BackButton.config._computeDefaultValue(BackButton.config.bind.icon)

export function Config(instance, config){
  //todo: user config
  for (var setting in config) {
    instance[setting] = config[setting][platformMode];
  }
}

export class ModeComponent extends Component {
  constructor(config) {
    config.hostAttributes = config.hostAttributes || {};
    let className = (config.hostAttributes['class'] || '');
    let id = config.classId || config.selector.replace('ion-', '');
    config.hostAttributes['class'] = (className + ' ' + id + ' ' + id + '-' + platformMode).trim();
    super(config);
  }
}

export class IonicComponent {
  constructor(ComponentClass, {
    properties,
    bind,
    enhanceRawElement,
    delegates,
    propClasses
  }) {
    // TODO give errors if not providing valid delegates
    ComponentClass.config = this
    this.componentCssName = util.pascalCaseToDashCase(ComponentClass.name)

    this.properties = properties || (properties = {});

    this.bind = bind || (bind = {})
    for (let attrName in bind) {
      let binding = bind[attrName]
      if (util.isObject(binding)) {
        binding.property || (binding.property = attrName)
        this._computeDefaultValue(binding)
        // TODO recompute defaultValue when user possibly adds a binding
      }
    }


    this.delegates = delegates || (delegates = {})
    this.propClasses = propClasses || (propClasses = []);

    // Whether to support raw element enhancement (for example, supporting <button>).
    // We only do this if there is a matching style property on the element
    this.enhanceRawElement = enhanceRawElement || false;

    // for (let delegateName of delegates) {
    //   let delegate = delegates[delegateName]
    // }
  }
  _computeDefaultValue(binding = {}) {
    let defaults = binding.defaults || {}
    binding._defaultValue = binding.value || defaults[platformMode] || defaults.base;
  }

  invoke(instance) {
    const config = this;

    // For each property class, check if it exists on the element and add the
    // corresponding classname for it, otherwise add it
    let foundMatchingPropClass = false;
    for (let propClass of this.propClasses) {
      if(dom.hasAttribute(instance.domElement, propClass)) {
        dom.addClass(instance.domElement, `${this.componentCssName}-${propClass}`);
        foundMatchingPropClass = true;
      }
    }

    // TODO: This worked fine for property-only buttons, but breaks with
    // class, etc.
    //
    // If we want to enhance a raw element (for example, a button),
    // only do it if we also have a matching prop class
    //if(!foundMatchingPropClass && this.enhanceRawElement) {
      // Don't enhace this raw element
      //return;
    //}

    // Add the base element classes (ex, button and button-ios)
    dom.addClass(instance.domElement, this.componentCssName, `${this.componentCssName}-${platformMode}`);

    // Check and apply and property classes (properties that should be
    // converted to class names). For example, <button primary> should
    // add the class button-primary

    for (let attrName in this.bind) {
      let binding = this.bind[attrName]
      let defaultValue = binding._defaultValue
      if (!instance[binding.property] && defaultValue) {
        instance[binding.property] = defaultValue
        instance.domElement.setAttribute(util.pascalCaseToDashCase(attrName), defaultValue)
      }
    }

    return {
      properties: this.properties,
      getDelegate(delegateName) {
        let cases = (config.delegates || {})[delegateName] || [];
        for (let i = 0; i < cases.length; i++) {
          let delegateCase = cases[i];
          if (util.isArray(delegateCase)) {
            let [ check, DelegateConstructor ] = delegateCase;
            if (check(instance)) {
              return new DelegateConstructor(instance);
            }
          } else {
            return new delegateCase(instance);
          }
        }
      }
    }
  }

}

/*
@IonicComponent({
  selector: 'ion-back-button',
  properties: {
    icon: {
      ios: 'ion-back-ios',
      android: 'ion-back-android',
      default: 'ion-back'
    }
  }
})
*/
