import { Component, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';
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

  private scrollEl?: HTMLIonScrollElement;

  @Prop() mode!: Mode;
  @Prop() color?: Color;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'document' }) doc!: Document;

  @State() canScrollLeft = false;
  @State() canScrollRight = false;
  @State() hidden = false;

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

  /**
   * If true, the tabs will be scrollable when there are enough tabs to overflow the width of the screen.
   */
  @Prop() scrollable = false;

  /** The tabs to render */
  @Prop() tabs: HTMLIonTabElement[] = [];

  @Watch('selectedTab')
  selectedTabChanged() {
    this.scrollable && this.scrollToSelectedButton();
    this.highlight && this.updateHighlight();
  }

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
    setTimeout(() => this.hidden = false, 50);
  }

  @Listen('body:keyboardWillShow')
  protected onKeyboardWillShow() {
    if (this.placement === 'bottom') {
      this.hidden = true;
    }
  }

  @Listen('window:resize')
  onResize() {
    this.highlight && this.updateHighlight();
  }

  componentDidLoad() {
    this.scrollable && this.updateBoundaries();
    this.highlight && this.updateHighlight();
  }

  protected analyzeTabs() {
    const tabs: HTMLIonTabButtonElement[] = Array.from(this.doc.querySelectorAll('ion-tab-button'));
    const scrollLeft = this.scrollEl!.scrollLeft;
    const tabsWidth = this.scrollEl!.clientWidth;
    let previous: {tab: HTMLIonTabButtonElement, amount: number}|undefined = undefined;
    let next: {tab: HTMLIonTabButtonElement, amount: number}|undefined = undefined;

    for (const tab of tabs) {
      const left = tab.offsetLeft;
      const right = left + tab.offsetWidth;

      if (left < scrollLeft) {
        previous = {tab, amount: left};
      }

      if (!next && right > (tabsWidth + scrollLeft)) {
        const amount = right - tabsWidth;
        next = {tab, amount};
      }
    }

    return {previous, next};
  }

  private getSelectedButton(): HTMLIonTabButtonElement | undefined {
    return Array.from(this.el.querySelectorAll('ion-tab-button'))
      .find(btn => btn.selected);
  }

  protected scrollToSelectedButton() {
    if (!this.scrollEl) {
      return;
    }
    this.queue.read(() => {
      const activeTabButton = this.getSelectedButton();

      if (activeTabButton) {
        const scrollLeft: number = this.scrollEl!.scrollLeft,
          tabsWidth: number = this.scrollEl!.clientWidth,
          left: number = activeTabButton.offsetLeft,
          right: number = left + activeTabButton.offsetWidth;

        let amount = 0;

        if (right > (tabsWidth + scrollLeft)) {
          amount = right - tabsWidth;
        } else if (left < scrollLeft) {
          amount = left;
        }

        if (amount !== 0) {
          this.queue.write(() => {
            this.scrollEl!.scrollToPoint(amount, 0, 250).then(() => {
              this.updateBoundaries();
            });
          });
        }
      }
    });
  }

  private scrollByTab(direction: 'left' | 'right') {
    this.queue.read(() => {
      const {previous, next} = this.analyzeTabs();
      const info = direction === 'right' ? next : previous;
      const amount = info && info.amount;

      if (info && amount) {
        this.scrollEl!.scrollToPoint(amount, 0, 250).then(() => {
          this.updateBoundaries();
        });
      }
    });
  }

  private updateBoundaries() {
    this.canScrollLeft = this.scrollEl!.scrollLeft !== 0;
    this.canScrollRight = this.scrollEl!.scrollLeft < (this.scrollEl!.scrollWidth - this.scrollEl!.offsetWidth);
  }

  private updateHighlight() {
    if (!this.highlight) {
      return;
    }
    this.queue.read(() => {
      const btn = this.getSelectedButton();
      const highlight = this.el.querySelector('div.tabbar-highlight') as HTMLElement;
      if (btn && highlight) {
        highlight.style.transform = `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`;
      }
    });
  }

  hostData() {
    return {
      role: 'tablist',
      class: {
        ...createColorClasses(this.color),
        'tabbar-translucent': this.translucent,
        [`layout-${this.layout}`]: true,
        [`placement-${this.placement}`]: true,
        'tabbar-hidden': this.hidden,
        'scrollable': this.scrollable
      }
    };
  }

  render() {
    const selectedTab = this.selectedTab;
    const ionTabbarHighlight = this.highlight ? <div class="animated tabbar-highlight" /> as HTMLElement : null;
    const tabButtons = this.tabs.map(tab => <ion-tab-button
      id={tab.btnId}
      label={tab.label}
      icon={tab.icon}
      badge={tab.badge}
      disabled={tab.disabled}
      badgeColor={tab.badgeColor}
      href={tab.href}
      selected={selectedTab === tab}
      mode={this.mode}
      color={this.color}
      class={{ 'tab-hidden': !tab.show }}
      onClick={(ev) => {
        if (!tab.disabled) {
          this.ionTabbarClick.emit(tab);
        }
        ev.stopPropagation();
        ev.preventDefault();
      }}
    />);

    if (this.scrollable) {
      return [
        <ion-button onClick={() => this.scrollByTab('left')} fill="clear" class={{inactive: !this.canScrollLeft}}>
          <ion-icon name="arrow-dropleft"/>
        </ion-button>,

        <ion-scroll forceOverscroll={false} ref={(scrollEl) => this.scrollEl = scrollEl as HTMLIonScrollElement}>
          {tabButtons}
          {ionTabbarHighlight}
        </ion-scroll>,

        <ion-button onClick={() => this.scrollByTab('right')} fill="clear" class={{inactive: !this.canScrollRight}}>
          <ion-icon name="arrow-dropright"/>
        </ion-button>
      ];
    } else {
      return [
        ...tabButtons,
        ionTabbarHighlight
      ];
    }
  }
}
