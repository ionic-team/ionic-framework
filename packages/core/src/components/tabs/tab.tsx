import { Component, Element, Event, EventEmitter, Method, Prop, PropDidChange, State } from '@stencil/core';
import { StencilElement, ViewController } from '../../index';

/**
 * @name Tab
 * @description
 * The Tab component, written `<ion-tab>`, is styled based on the mode and should
 * be used in conjunction with the [Tabs](../Tabs/) component.
 *
 * Each `ion-tab` is a declarative component for a [NavController](../../../navigation/NavController/).
 * Basically, each tab is a `NavController`. For more information on using
 * navigation controllers take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 * See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.
 *
 * @usage
 *
 * To add a basic tab, you can use the following markup where the `root` property
 * is the page you want to load for that tab, `tabTitle` is the optional text to
 * display on the tab, and `tabIcon` is the optional [icon](../../icon/Icon/).
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then, in your class you can set `chatRoot` to an imported class:
 *
 * ```ts
 * import { ChatPage } from '../chat/chat';
 *
 * export class Tabs {
 *   // here we'll set the property of chatRoot to
 *   // the imported class of ChatPage
 *   chatRoot = ChatPage;
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * You can also pass some parameters to the root page of the tab through
 * `rootParams`. Below we pass `chatParams` to the Chat tab:
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" [rootParams]="chatParams" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   chatRoot = ChatPage;
 *
 *   // set some user information on chatParams
 *   chatParams = {
 *     user1: 'admin',
 *     user2: 'ionic'
 *   };
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * And in `ChatPage` you can get the data from `NavParams`:
 *
 * ```ts
 * export class ChatPage {
 *   constructor(navParams: NavParams) {
 *     console.log('Passed params', navParams.data);
 *   }
 * }
 * ```
 *
 * Sometimes you may want to call a method instead of navigating to a new
 * page. You can use the `(ionSelect)` event to call a method on your class when
 * the tab is selected. Below is an example of presenting a modal from one of
 * the tabs.
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab (ionSelect)="chat()" tabTitle="Show Modal"></ion-tab>
 * </ion-tabs>pop
 * ```
 *
 * ```ts
 * export class Tabs {
 *   constructor(public modalCtrl: ModalController) {
 *
 *   }
 *
 *   chat() {
 *     let modal = this.modalCtrl.create(ChatPage);
 *     modal.present();
 *   }
 * }
 * ```
 *
 *
 * @demo /docs/demos/src/tabs/
 * @see {@link /docs/components#tabs Tabs Component Docs}
 * @see {@link ../../tabs/Tabs Tabs API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
@Component({
  tag: 'ion-tab',
})
export class Tab {

  private nav: Promise<HTMLIonNavElement>;
  private resolveNav: (el: HTMLIonNavElement) => void;

  @Element() el: HTMLElement;

  @State() init = false;
  @State() active = false;

  /**
   * @input {string} Set the root page for this tab.
   */
  @Prop() btnId: string;

  /**
   * @input {string} The URL path name to represent this tab within the URL.
   */
  @Prop() path: string;

  /**
   * @input {string} The title of the tab button.
   */
  @Prop() title: string;

  /**
   * @input {string} The icon for the tab button.
   */
  @Prop() icon: string;

  /**
   * @input {string} The badge for the tab button.
   */
  @Prop() badge: string;

  /**
   * @input {string} The badge color for the tab button.
   */
  @Prop() badgeStyle: string = 'default';

  /**
   * @input {boolean} If true, enable the tab. If false,
   * the user cannot interact with this element.
   * Default: `true`.
   */
  @Prop() enabled = true;

  /**
   * @input {boolean} If true, the tab button is visible within the
   * tabbar. Default: `true`.
   */
  @Prop() show = true;

  /**
   * @input {boolean} If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;

  constructor() {
    this.nav = new Promise((resolve) => this.resolveNav = resolve);
  }

  @Prop({ mutable: true }) selected = false;
  @PropDidChange('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit(this.el);
    }
  }

  /**
   * @output {Tab} Emitted when the current tab is selected.
   */
  @Event() ionSelect: EventEmitter;

  protected componentDidUpdate() {
    if (this.init && this.resolveNav) {
      const nav = this.el.querySelector('ion-nav') as any as StencilElement;
      if (nav) {
        nav.componentOnReady(this.resolveNav);
      } else {
        this.resolveNav(null);
      }
      this.resolveNav = null;
    }
  }

  @Method()
  _setActive(active: boolean): Promise<any> {
    if (this.active === active) {
      return Promise.resolve();
    }
    this.active = active;
    this.selected = active;

    return Promise.resolve();
  }

  @Method()
  goToRoot(opts: any = {}) {
    return this.nav.then(nav => nav && nav.setRoot(nav.root, null, opts));
  }

  @Method()
  getActive(): Promise<ViewController> {
    return this.nav.then(nav => nav && nav.getActive());
  }

  @Method()
  getNav(): Promise<HTMLIonNavElement> {
    return this.nav;
  }

  protected hostData() {
    const visible = this.active && this.selected;
    return {
      'aria-hidden': !visible ? 'true' : null,
      'aria-labelledby': this.btnId,
      'role': 'tabpanel',
      class: {
        'show-tab': this.active
      }
    };
  }
}
