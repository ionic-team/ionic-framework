import { Build, Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';
import { Color, ComponentRef, FrameworkDelegate } from '../../interface';
import { attachComponent } from '../../utils/framework-delegate';

@Component({
  tag: 'ion-tab'
})
export class Tab {

  private loaded = false;
  @Element() el!: HTMLIonTabElement;

  @Prop({ mutable: true }) active = false;

  @Prop() btnId?: string;
  @Prop() delegate?: FrameworkDelegate;

  /**
   * The title of the tab.
   */
  @Prop() label?: string;

  /**
   * The URL which will be used as the `href` within this tab's `<ion-tab-button>` anchor.
   */
  @Prop() href?: string;

  /**
   * The icon for the tab.
   */
  @Prop() icon?: string;

  /**
   * The badge for the tab.
   */
  @Prop() badge?: string;

  /**
   * The badge color for the tab button.
   */
  @Prop() badgeColor: Color = 'default';

  /**
   * The component to display inside of the tab.
   */
  @Prop() component?: ComponentRef;

  /**
   * The name of the tab.
   */
  @Prop() name?: string;

  /**
   * If true, the user cannot interact with the tab. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the tab will be selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) selected = false;

  @Watch('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit();
    }
  }

  /**
   * If true, the tab button is visible within the tabbar. Defaults to `true`.
   */
  @Prop() show = true;

  /**
   * If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;


  /**
   * Emitted when the current tab is selected.
   */
  @Event() ionSelect!: EventEmitter<void>;

  componentWillLoad() {
    if (Build.isDev) {
      if (this.component && this.el.childElementCount > 0) {
        console.error('You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
      `- Remove the component attribute in: <ion-tab component="${this.component}">` +
      ` or` +
      `- Remove the embeded content inside the ion-tab: <ion-tab></ion-tab>`);
      }
    }
  }

  @Method()
  getTabId(): string|null {
    if (this.name) {
      return this.name;
    }
    if (typeof this.component === 'string') {
      return this.component;
    }
    return null;
  }

  @Method()
  async setActive(): Promise<void> {
    await this.prepareLazyLoaded();
    this.active = true;
  }

  private prepareLazyLoaded(): Promise<HTMLElement|void> {
    if (!this.loaded && this.component) {
      this.loaded = true;
      return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
    }
    return Promise.resolve();
  }

  hostData() {
    return {
      'aria-labelledby': this.btnId,
      'role': 'tabpanel',
      'hidden': !this.active,
      'class': {
        'ion-page': !this.component
      }
    };
  }
}
