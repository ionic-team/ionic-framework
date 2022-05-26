interface StyleOptions {
  style: Style;
}

export enum Style {
  Dark = 'DARK',
  Light = 'LIGHT',
  Default = 'DEFAULT',
}

export const StatusBar = {
  getEngine() {
    const win = window as any;
    return (win.Capacitor?.isPluginAvailable('StatusBar') && win.Capacitor.Plugins.StatusBar);
  },
  setStyle(options: StyleOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.setStyle(options);
  }
};
