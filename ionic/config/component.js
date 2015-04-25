import * as util from 'ionic2/util'
import {platform} from 'ionic2/platform/platform'

let platforms = Object.keys(platform.registry)
let platformName = platform.getName()

// Low-level: how the user will override
// BackButton.config.bind.icon.value = 'ion-chevron-right'
// BackButton.config._computeDefaultValue(BackButton.config.bind.icon)

export class IonicComponent {
  constructor(ComponentClass, {
    bind,
    delegates,
    propClasses
  }) {
    // TODO give errors if not providing valid delegates
    ComponentClass.config = this
    this.componentCssName = util.pascalCaseToDashCase(ComponentClass.name)

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
    // for (let delegateName of delegates) {
    //   let delegate = delegates[delegateName]
    // }
  }
  _computeDefaultValue(binding = {}) {
    let defaults = binding.defaults || {}
    binding._defaultValue = binding.value || defaults[platformName] || defaults.base;
  }

  invoke(instance) {
    const config = this
    instance.domElement.classList.add(this.componentCssName)
    instance.domElement.classList.add(`${this.componentCssName}-${platformName}`)

    // For each property class, check if it exists on the element and add the
    // corresponding classname for it
    for (let propClass of this.propClasses) {
      if(instance.domElement.hasAttribute(propClass)) {
        instance.domElement.classList.add(`${this.componentCssName}-${propClass}`)
      }
    }

    /****** TODO: HACK!!! MAKE MORE GOOD!!! ********/
    /*
      Manually assigning "md" for android platform, but we need
      to be able to set which "mode" to use for each platform.

      ios platform == ios mode
      android platform == md mode (material design mode)
      everything else == core mode

      Uber hack below until we come up with a pretty "mode" API
    */
    if (platformName == 'android') {
      instance.domElement.classList.add(`${this.componentCssName}-md`)
    }
    /****** TODO: HACK!!! MAKE MORE GOOD!!! ********/


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
  bind: {
    icon: {
      ios: 'ion-back-ios',
      android: 'ion-back-android',
      default: 'ion-back'
    }
  }
})
*/
