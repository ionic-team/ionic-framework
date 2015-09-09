/**
 * Simple wrapper page for the side menu toggle.
 */
export class SinkPage {
  constructor(app: IonicApp) {
    this.app = app;
  }
  toggleMenu() {
    let aside = this.app.getComponent('mainMenu');
    aside.toggle();
  }
}
