import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import * as util from 'ionic/util'
import {dom} from 'ionic/util'
import {Platform} from 'ionic/platform/platform'

let platformMode = Platform.getMode();


export function Config(instance, config){
  for (var setting in config) {
    instance[setting] = config[setting][platformMode];
  }
}

export class ModeComponent extends Component {
  constructor(config) {
    super( appendModeConfig(config) );
  }
}

export class ModeDirective extends Directive {
  constructor(config) {
    super( appendModeConfig(config) );
  }
}

export class IonicComponentNEW extends ModeComponent {
  constructor(ComponentType) {
    let config = ComponentType.config;
    const defaultProperties = config.defaultProperties;

    config.properties = config.properties || [];
    config.hostProperties = config.hostProperties || {};

    for (let prop in defaultProperties) {
      // add the property to the component "properties"
      config.properties.push(prop);

      // set the component "hostProperties", so the instance's
      // property value will be used to set the element's attribute
      config.hostProperties[prop] = 'attr.' + util.pascalCaseToDashCase(prop);
    }

    // called by the component's onInit when an instance has been created and properties bound
    ComponentType.applyConfig = (instance) => {
      for (let prop in defaultProperties) {
        // Priority:
        // ---------
        // 1) Value set from within constructor
        // 2) Value set from the host element's attribute
        // 3) Value set by the users global config
        // 4) Value set by the default mode/platform config
        // 5) Value set from the component's default

        if (instance[prop]) {
          // this property has already been set on the instance
          // could be from the user setting the element's attribute
          // or from the user setting it within the constructor
          continue;
        }

        // get the property values from a global user config
        var globalPropertyValue = null;
        if (globalPropertyValue) {
          instance[prop] = globalPropertyValue;
          continue;
        }

        // get the property values provided by this mode/platform
        var modePropertyValue = null;
        if (modePropertyValue) {
          instance[prop] = modePropertyValue;
          continue;
        }

        // wasn't set yet, so go with property's default value
        instance[prop] = defaultProperties[prop];
      }
    };

    super(config);
  }
}

function appendModeConfig(config) {
  config = config || {};
  config.hostAttributes = config.hostAttributes || {};
  let className = (config.hostAttributes['class'] || '');
  let id = config.classId || config.selector.replace('ion-', '');
  config.hostAttributes['class'] = (className + ' ' + id + ' ' + id + '-' + platformMode).trim();
  return config;
}

export class IonicComponent {
  constructor(ComponentType, {
    properties,
    bind,
    enhanceRawElement,
    delegates,
    propClasses
  }) {
    // TODO give errors if not providing valid delegates
    ComponentType.config = this
    this.componentCssName = util.pascalCaseToDashCase(ComponentType.name)

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
