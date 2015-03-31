import {platform} from 'ionic2/platform/platform'
import * as util from 'ionic2/util'


/*
let MyConfig = new ComponentConfig(MyComponent)
MyConfig.classes('classes')
MyConfig.delegate('gesture')
  .when({side: 'left'}, LeftAsideGesture)
  .when({side: 'right'}, RightAsideGesture)
  .when({side: 'top'}, TopAsideGesture)
  .when({side: 'bottom'}, BottomAsideGesture)
*/
export function ComponentConfig(componentCssName) {
  let platformName = platform.get().name;
  return class Config {
    static classes() {
      Config.classProperties || (Config.classProperties = [])
      Config.classProperties.push.apply(Config.classProperties, arguments)
      return Config
    }
    static delegate(delegateName) {
      let self = {
        when(condition, DelegateConstructor) {
          Config.addCase(delegateName, condition, DelegateConstructor) 
          return self
        }
      }
      return self
    }
    static platform(name, Class) {
      Config.platformFns = Config.platformFns || []
      if (name === platformName) {
        Config.platformFns.unshift(Class)
      }
      return Config
    }
    static addCase(delegateName, condition, DelegateConstructor) {
      Config.registry || (Config.registry = {})
      var array = (Config.registry[delegateName] || (Config.registry[delegateName] = []))

      let callback = condition
      if (util.isObject(callback)) {
        // Support eg `{side: 'left'}` as a condition
        callback = (instance) => {
          for (let key in condition) {
            if (condition.hasOwnProperty(key) && instance[key] !== condition[key]) {
              return false
            }
          }
          return true
        }
      }
      array.unshift({ callback, DelegateConstructor })
    }

    create(instance) {
      instance.domElement.classList.add(componentCssName)
      instance.domElement.classList.add(`${componentCssName}-${platformName}`)
      for (let i = 0; i < (Config.classProperties || []).length; i++) {
        let propertyValue = instance[Config.classProperties[i]]
        instance.domElement.classList.add(`${componentCssName}-${propertyValue}`)
      }
      for (let i = 0; i < (Config.platformFns || []).length; i++) {
        new Config.platformFns[i](instance)
      }
      return {
        getDelegate(delegateName) {
          let registry = Config.registry && Config.registry[delegateName] || []
          for (let i = 0; i < registry.length; i++) {
            let condition = registry[i]
            if (condition.callback(instance)) {
              return new condition.DelegateConstructor(instance)
            }
          }
        }
      }
    }

  }

}


// TODO stop hardcoding platforms and media sizes

/*
@ConfigPlatform({
  for: AsideBase
  platform: 'android', 
  defaults: {
    type: 'reveal'
  }
})
class AndroidAside extends AsideBase {}

```@ConfigCase({
  for: AsideBase,
  condition: instance => instance.type === 'reveal'
})
class AsideReveal {
  constructor(aside: AsideBase) {}
}
*/

// export class Config extends ConfigCase {
//   constructor() {
//     this._root = this
//     this._cases = {}
//     super({
//       root: this, 
//       parent: null, 
//       path: '' 
//     })
//   }
//   invoke(instance) {
//     return invokeConfig(this, instance)
//   }
//   _addCase(key, baseCase) {
//     let path = baseCase._path.slice()
//     path.push(key)

//     // Remove empties & duplicates
//     path = path
//       .filter((value, index) => {
//         return value && path.indexOf(value) === index
//       })
//       .sort()

//     if (path.join(' ') === baseCase._path.join(' ')) {
//       return baseCase
//     }
//     return this._createCase(path)
//   }
//   _createCase(path) {
//     if (!path.length) return this
//     let pathStr = path.join(' ')
//     let configCase = this._cases[pathStr]
//     if (!configCase) {
//       let parentPath = path.slice(0, path.length - 1)
//       configCase = this._cases[pathStr] = new ConfigCase({
//         root: this, 
//         parent: this._createCase(parentPath), 
//         path: path
//       })
//     }
//     return configCase
//   }
// }

// export function invokeConfig(config, object) {
//   let platformName = platform.get().name

//   let passedCases = [config].concat(
//     Object.keys(config._cases)
//       .map(name => config._cases[name])
//       .filter(configCasePasses)
//       .sort(function(a,b) {
//         return a._path.length < b._path.length ? -1 : 1
//       })
//   )

//   // Extend the given object with the values of all the passed cases, starting with the
//   // most specific.
//   let defaults = [object]
//   // Also find the most specific case with a component that we should use.
//   let ComponentToUse
//   for (let i = 0, ii = passedCases.length i < ii i++) {
//     defaults.push(passedCases[i]._values)
//     if (passedCases[i]._component) {
//       ComponentToUse = passedCases[i]._component
//     }
//   }

//   util.defaults.apply(null, defaults)

//   return ComponentToUse

//   function configCasePasses(configCase) {
//     let path = configCase._path
//     let key
//     for (let i = 0, ii = path.length i < ii i++) {
//       if (platformName !== path[i]) return false
//     }
//     return true
//   }

// }
