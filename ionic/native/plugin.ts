export class NativePluginDecorator {
  constructor(cls, config) {
    this.cls = cls;
    this.config = config;

    cls.pluginWarn = () => {
      let platformString = [];
      for(var k in this.config.platforms) {
        platformString.push('\t' + k + ': '+ this.config.platforms[k]);
      }
      console.warn('Plugin for ' + this.config.name +
      ' not installed. For native functionality, please instead the correct plugin for your platform:\n' +
      platformString.join('\n'));
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
