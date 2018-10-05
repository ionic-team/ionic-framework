import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { Color, Mode, TabbarLayout, TabbarPlacement } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-tabbar',
  styleUrls: {
    ios: 'tabbar.ios.scss',
    md: 'tabbar.md.scss'
  },
  scoped: true
})
export class Tabbar implements ComponentInterface {

  @Prop() mode!: Mode;
  @Prop() color?: Color;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'document' }) doc!: Document;

  @State() canScrollLeft = false;
  @State() canScrollRight = false;
  @State() keyboardVisible = false;

  /**
   * Set the layout of the text and icon in the tabbar. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"label-hide"`.
   */
  @Prop() layout: TabbarLayout = 'icon-top';

  /**
   * Set the position of the tabbar, relative to the content. Available options: `"top"`, `"bottom"`.
   */
  @Prop() placement: TabbarPlacement = 'bottom';

  /** The selected tab component */
  @Prop() selectedTab?: HTMLIonTabElement;

  /** The tabs to render */
  @Prop() tabs: HTMLIonTabElement[] = [];

  /**
   * If true, show the tab highlight bar under the selected tab.
   */
  @Prop() highlight = false;

  /**
   * If true, the tabbar will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /** Emitted when the tab bar is clicked  */
  @Event() ionTabbarClick!: EventEmitter<HTMLIonTabElement>;

  @Listen('body:keyboardWillHide')
  protected onKeyboardWillHide() {
    setTimeout(() => this.keyboardVisible = false, 50);
  }

  @Listen('body:keyboardWillShow')
  protected onKeyboardWillShow() {
    if (this.placement === 'bottom') {
      this.keyboardVisible = true;
    }
  }

  componentDidLoad() {
    this.updateHighlight();
  }

  private getSelectedButton(): HTMLElement | null {
    return this.el.shadowRoot!.querySelector('.tab-btn-selected');
  }

  @Watch('selectedTab')
  @Listen('window:resize')
  private updateHighlight() {
    if (!this.highlight) {
      return;
    }
    this.queue.read(() => {
      const btn = this.getSelectedButton();
      const highlight = this.el.shadowRoot!.querySelector('.tabbar-highlight') as HTMLElement;
      if (btn && highlight) {
        highlight.style.transform = `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`;
      }
    });
  }

  hostData() {
    const { color, translucent, layout, placement, keyboardVisible } = this;
    return {
      role: 'tablist',
      'aria-hidden': keyboardVisible ? 'true' : null,
      class: {
        ...createColorClasses(color),
        'tabbar-translucent': translucent,
        [`layout-${layout}`]: true,
        [`placement-${placement}`]: true,
        'tabbar-hidden': keyboardVisible,
      }
    };
  }

  renderTabButton(tab: HTMLIonTabElement) {
    const { icon, label, disabled, badge, badgeColor, href } = tab;
    const selected = tab === this.selectedTab;
    const hasLabel = label !== undefined;
    const hasIcon = icon !== undefined;
    return (
      <a
        role="tab"
        ion-activatable
        aria-selected={selected ? 'true' : null}
        href={href || '#'}
        class={{
          'tab-btn': true,
          'tab-btn-selected': selected,
          'tab-btn-has-label': hasLabel,
          'tab-btn-has-icon': hasIcon,
          'tab-btn-has-label-only': hasLabel && !hasIcon,
          'tab-btn-has-icon-only': hasIcon && !hasLabel,
          'tab-btn-has-badge': badge !== undefined,
          'tab-btn-disabled': disabled,
          'tab-btn-hidden': !tab.show
        }}
        onClick={ev => {
          if (!tab.disabled) {
            this.ionTabbarClick.emit(tab);
          }
          ev.preventDefault();
        }}
      >
        {icon && <ion-icon class="tab-btn-icon" icon={icon} lazy={false}></ion-icon>}
        {label && <span class="tab-btn-text">{label}</span>}
        {badge && <ion-badge class="tab-btn-badge" color={badgeColor}>{badge}</ion-badge>}
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </a>
    );
  }

  render() {
    return [
      this.tabs.map(tab => this.renderTabButton(tab)),
      this.highlight && <div class="animated tabbar-highlight" />
    ];
  }
}
