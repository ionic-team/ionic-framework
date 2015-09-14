export class NativePluginDecorator {
  constructor(cls, config) {
    this.cls = cls;
    this.config = config;

    cls.ifPlugin = (check, cb, returnType=null) => {
      // Convert to boolean the plugin param
      var exists = !!check;
      if(typeof check === 'function') {
        exists = check();
      }
      if(exists) {
        return cb();
      }

      cls.pluginWarn();

      return (typeof returnType === 'function') ? returnType() : returnType;
    };

    cls.pluginWarn = () => {
      if(cls._pluginWarned) {
        // Only warn once
        return;
      }

      let platformString = [];
      for(var k in this.config.platforms) {
        platformString.push('\t' + k + ': '+ this.config.platforms[k]);
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
