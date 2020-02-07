import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-drawer',
  styleUrls: {
    ios: 'drawer.ios.scss',
    md: 'drawer.md.scss'
  }
})
export class Drawer implements ComponentInterface {

  private drawerReady = false;
  private readyDrawer!: (drawer: any) => void;
  private drawer: Promise<any> = new Promise(resolve => { this.readyDrawer = resolve; });

  @Element() el!: HTMLIonDrawerElement;

  /**
   * Options to pass to the drawer instance.
   * See https://github.com/roman-rr/cupertino-pane/ for valid options
   */
  @Prop() options: any = {}; // DrawerOptions;

  @Watch('options')
  async optionsChanged() {
    if (this.drawerReady) {
      const drawer = await this.getDrawer();
      Object.assign(drawer.settings, this.options);
      console.log(drawer.settings);
      await this.update();
    }
  }

  /**
   * If `true`, show the drawer right after component loaded.
   */
  @Prop() presentDefault = false;

  /**
   * Emitted after pane will dissapeared
   */
  @Event() ionDrawerDidDismiss!: EventEmitter<void>;

  /**
   * Emitted before pane will dissapeared
   */
  @Event() ionDrawerWillDismiss!: EventEmitter<void>;

  /**
   * Emitted after pane will present
   */
  @Event() ionDrawerTransitionEnd!: EventEmitter<void>;

  /**
   * Emitted before panel will present
   */
  @Event() ionDrawerWillPresent!: EventEmitter<void>;

  /**
   * Emitted when detect user drag event on pane
   */
  @Event() ionDrawerDragStart!: EventEmitter<void>;

  /**
   * Emitted executes on each new pane position
   */
  @Event() ionDrawerOnDrag!: EventEmitter<void>;

  componentDidLoad() {
    this.el.componentOnReady().then(() => this.initDrawer());
  }

  /**
   * Update the underlying Drawer implementation.
   */
  @Method()
  async update() {
    const drawer = await this.getDrawer();
    drawer.destroy();
    drawer.present();
  }

  /**
   * Render and show Drawer pane from ion-drawer component
   */
  @Method()
  async present(conf: {} = { animate: false }) {
    const drawer = await this.getDrawer();
    drawer.present(conf);
    this.drawerReady = true;
  }

  /**
   * Remove pane from DOM and clear styles
   */
  @Method()
  async destroy(conf: {} = { animate: false }) {
    if (this.drawerReady) {
      const drawer = await this.getDrawer();
      console.log('13232345234v2 23452345 ', drawer);
      drawer.destroy(conf);
      this.drawerReady = false;
    }
  }

  /**
   * Will change pane position with animation to selected breakpoint
   */
  @Method()
  async moveToBreak(val: 'top' | 'middle' | 'bottom') {
    const drawer = await this.getDrawer();
    try {
      drawer.moveToBreak(val);
    } catch (err) {
      console.warn('Drawer is not present');
    }
  }

  /**
   * Dissappear pane from screen, still keep pane in DOM
   */
  @Method()
  async hide() {
    const drawer = await this.getDrawer();
    try {
      drawer.hide();
    } catch (err) {
      console.warn('Drawer is not present');
    }
  }

  /**
   * Determinate if drawer position was moved out of screen, but pane still exist in DOM.
   */
  @Method()
  async isHidden(): Promise<boolean | null> {
    const drawer = await this.getDrawer();
    try {
      return drawer.isHidden();
    } catch (err) {
      console.warn('Drawer is not present');
      return null;
    }
  }

  /**
   * Use this to access the full Drawer API.
   */
  @Method()
  async getDrawer(): Promise<any> {
    return this.drawer;
  }

  private async initDrawer() {
    const finalOptions = this.normalizeOptions();

    // init drawer core
    const { CupertinoPane } = await import('cupertino-pane');
    const drawer = new CupertinoPane('ion-drawer', finalOptions);
    this.readyDrawer(drawer);
    if (this.presentDefault) {
      this.present();
      this.drawerReady = true;
    }
  }

  private get deviceOffset() {
    // Calc device offsets (statusbars, bottom, top, iPhone X, XS etc.)
    const sat = getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-top');
    const sab = getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-bottom');
    const offset = parseFloat(sat.replace('px', '')) + parseFloat(sab.replace('px', ''));
    return offset;
  }

  private normalizeOptions(): any {
    // Base options, can be changed
    // TODO Add interface DrawerOptions
    const drawerOptions: any = {};

    // Events
    const eventOptions: any = {
      onDidDismiss: this.ionDrawerDidDismiss.emit,
      onWillDismiss: this.ionDrawerWillDismiss.emit,
      onDidPresent: this.ionDrawerTransitionEnd.emit,
      onWillPresent: this.ionDrawerWillPresent.emit,
      onDragStart: this.ionDrawerDragStart.emit,
      onDrag: this.ionDrawerOnDrag.emit
    };

    if (this.options.topperOverflowOffset) {
      this.options.topperOverflowOffset += this.deviceOffset;
    } else {
      this.options.topperOverflowOffset = this.deviceOffset;
    }

    // Merge the base, user options, and events together then pas to swiper
    return { ...drawerOptions, ...this.options, ...eventOptions };
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [`${mode}`]: true,
          [`drawer-${mode}`]: true
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
