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
    delegates
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

    for (let attrName in this.bind) {
      let binding = this.bind[attrName]
      let defaultValue = binding._defaultValue
      if (!instance[binding.property] && defaultValue) {
        instance[binding.property] = defaultValue
        instance.domElement.setAttribute(attrName, defaultValue)
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
