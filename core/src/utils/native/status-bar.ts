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
    return win.Capacitor?.isPluginAvailable('StatusBar') && win.Capacitor.Plugins.StatusBar;
  },
  supportsDefaultStatusBarStyle() {
    const win = window as any;

    /**
     * The 'DEFAULT' status bar style was added
     * to the @capacitor/status-bar plugin in Capacitor 3.
     * PluginHeaders is only supported in Capacitor 3+,
     * so we can use this to detect Capacitor 3.
     */
    return !!win.Capacitor?.PluginHeaders;
  },
  setStyle(options: StyleOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.setStyle(options);
  },
};
