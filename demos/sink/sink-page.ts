/**
 * Simple wrapper page for the side menu toggle.
 */
export class SinkPage {
  constructor(app: IonicApp) {
    this.app = app;
  }
  toggleMenu() {
    let menu = this.app.getComponent('mainMenu');
    menu.toggle();
  }
}
