import { Build, Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';

import { Color, ComponentRef, FrameworkDelegate } from '../../interface';
import { attachComponent } from '../../utils/framework-delegate';

@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss',
  shadow: true
})
export class Tab implements ComponentInterface {

  private loaded = false;
  @Element() el!: HTMLIonTabElement;

  /**
   * If true, sets the tab as the active tab.
   */
  @Prop({ mutable: true }) active = false;

  /** hidden */
  @Prop() btnId?: string;

  /** hidden */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * The label of the tab.
   */
  @Prop() label?: string;

  /**
   * The URL which will be used as the `href` within this tab's button anchor.
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
  @Prop() badgeColor?: Color;

  /**
   * The component to display inside of the tab.
   */
  @Prop() component?: ComponentRef;

  /**
   * The name of the tab.
   */
  @Prop({ mutable: true }) name?: string;

  /**
   * If true, the user cannot interact with the tab. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the tab will be selected. Defaults to `false`.
   */
  @Prop() selected = false;

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

  /**
   * Emitted when the tab props mutates. Used internally.
   */
  @Event() ionTabMutated!: EventEmitter<void>;

  componentWillLoad() {
    // Set default name
    if (this.name === undefined && typeof this.component === 'string') {
      this.name = this.component;
    }

    if (Build.isDev) {
      if (this.component !== undefined && this.el.childElementCount > 0) {
        console.error('You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
      `- Remove the component attribute in: <ion-tab component="${this.component}">` +
      ` or` +
      `- Remove the embedded content inside the ion-tab: <ion-tab></ion-tab>`);
      }
    }
  }

  @Watch('label')
  @Watch('href')
  @Watch('show')
  @Watch('disabled')
  @Watch('badge')
  @Watch('badgeColor')
  @Watch('icon')
  onPropChanged() {
    this.ionTabMutated.emit();
  }

  /** Set the active component for the tab */
  @Method()
  async setActive(): Promise<void> {
    await this.prepareLazyLoaded();
    this.active = true;
  }

  private prepareLazyLoaded(): Promise<HTMLElement | void> {
    if (!this.loaded && this.component != null) {
      this.loaded = true;
      return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
    }
    return Promise.resolve();
  }

  hostData() {
    const { btnId, active, component } = this;
    return {
      'aria-labelledby': btnId,
      'aria-hidden': !active ? 'true' : null,
      'role': 'tabpanel',
      'class': {
        'ion-page': component === undefined,
        'tab-hidden': !active
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
