export class NativePluginDecorator {
  constructor(cls, config) {
    this.cls = cls;
    this.config = config;

    cls.ifPlugin = (cb, returnType=null) => {
      // Convert to boolean the plugin param
      var exists = !!check;
      if(typeof this.config.pluginCheck === 'function') {
        exists = this.config.pluginCheck();
      }
      if(exists) {
        return cb();
      }

      // We don't have the plugin, so print a warning message
      cls.pluginWarn();

      // If the user supplied a default return value, return it here.
      if(returnType) {
        return (typeof returnType === 'function') ? returnType() : returnType;
      }
      
      return false;
    };

    cls.pluginWarn = () => {
      if(cls._pluginWarned) {
        // Only warn once
        return;
      }

      let platformString = [];
      for(var k in this.config.engines) {
        platformString.push('\t' + k + ': '+ this.config.engines[k]);
      }
      console.warn('Plugin for ' + this.config.name +
      ' not installed. For native functionality, please install the correct plugin for your platform:\n' +
      platformString.join('\n'));

      // Set a flag so we don't warn again
      cls._pluginWarned = true;
    }
  }
}

export function NativePlugin(config) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new NativePluginDecorator(cls, config));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}
