import { Component, Element, Event, EventEmitter, Listen, Prop, QueueApi, State } from '@stencil/core';

import { Color, Mode, TabbarLayout, TabbarPlacement } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-tabbar',
  styleUrls: {
    ios: 'tabbar.ios.scss',
    md: 'tabbar.md.scss'
  },
  shadow: true
})
export class Tabbar {

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

  // @Watch('selectedTab')
  // selectedTabChanged() {
  //   this.updateHighlight();
  // }

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

  // @Listen('window:resize')
  // onResize() {
  //   this.updateHighlight();
  // }

  // componentDidLoad() {
  //   this.updateHighlight();
  // }

  // private getSelectedButton(): HTMLIonTabButtonElement | undefined {
  //   return Array.from(this.el.querySelectorAll('ion-tab-button'))
  //     .find(btn => btn.selected);
  // }

  // private updateHighlight() {
  //   if (!this.highlight) {
  //     return;
  //   }
  //   this.queue.read(() => {
  //     const btn = this.getSelectedButton();
  //     const highlight = this.el.querySelector('div.tabbar-highlight') as HTMLElement;
  //     if (btn && highlight) {
  //       highlight.style.transform = `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`;
  //     }
  //   });
  // }

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

  render() {
    const selectedTab = this.selectedTab;
    return [
      this.tabs.map(tab => renderTabButton(tab, tab === selectedTab, this.mode, () => {
        this.ionTabbarClick.emit(tab);
      })),
      this.highlight && <div class="animated tabbar-highlight" />
    ];
  }
}

function renderTabButton(tab: HTMLIonTabElement, selected: boolean, mode: string, onClick: () => void) {
  const { icon, label, disabled, badge, badgeColor, href } = tab;
  const hasLabel = !!label;
  const hasIcon = !!icon;
  const hasLabelOnly = (hasLabel && !hasIcon);
  const hasIconOnly = (hasIcon && !hasLabel);
  const hasBadge = !!badge;
  return (
    <a
      role="tab"
      aria-selected={selected ? 'true' : null}
      href={href || '#'}
      ion-activable
      class={{
        'tab-btn': true,
        'tab-btn-selected': selected,
        'tab-btn-has-label': hasLabel,
        'tab-btn-has-icon': hasIcon,
        'tab-btn-has-label-only': hasLabelOnly,
        'tab-btn-has-icon-only': hasIconOnly,
        'tab-btn-has-badge': hasBadge,
        'tab-btn-disabled': disabled,
        'tab-btn-hidden': !tab.show
      }}
      onClick={ev => {
        if (!tab.disabled) {
          onClick();
        }
        ev.stopPropagation();
        ev.preventDefault();
      }}>
        { icon && <ion-icon class="tab-btn-icon" icon={icon} lazy={false}></ion-icon> }
        { label && <span class="tab-btn-text">{label}</span> }
        { badge && <ion-badge class="tab-btn-badge" color={badgeColor}>{badge}</ion-badge> }
        { mode === 'md' && <ion-ripple-effect tapClick={true}></ion-ripple-effect> }
    </a>
  );
}
