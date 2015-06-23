import {Component, ComponentAnnotation, Directive} from 'angular2/angular2';
import {DirectiveMetadata} from 'angular2/src/render/api';

import * as util from 'ionic/util';
import {Platform} from 'ionic/platform/platform';

const platformMode = Platform.getMode();

export class IonicDirective extends Directive {
  constructor(ComponentType) {
    super( appendModeConfig(ComponentType) );
  }
}

export let IonicComponent = (function(){
  function IonicComponentFactory(ComponentClass) {
    return new Component(appendModeConfig(ComponentClass));
  }
  IonicComponentFactory.prototype = Object.create(ComponentAnnotation.prototype);
  return IonicComponentFactory;
})();


function appendModeConfig(ComponentType) {
  let config = ComponentType.config;
  config.host = config.host || {};

//  let host = DirectiveMetadata.parseHostConfig(config.host);

  const defaultProperties = config.defaultProperties;

  config.properties = config.properties || [];

  for (let prop in defaultProperties) {
    // add the property to the component "properties"
    config.properties.push(prop);

    // set the component "hostProperties", so the instance's
    // property value will be used to set the element's attribute
    config.host['[attr.' + util.pascalCaseToDashCase(prop) + ']'] = prop;
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

  if (config.delegates) {
    ComponentType.getDelegate = (instance, delegateName) => {
      let cases = config.delegates[delegateName] || [];
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
    };
  }

  let id = config.classId || (config.selector && config.selector.replace('ion-', ''));
  config.host['class'] = (id + ' ' + id + '-' + platformMode);

  return config;
}
