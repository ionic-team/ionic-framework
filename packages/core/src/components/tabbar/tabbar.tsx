import { Component, Element, Listen, Prop, State, Watch } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { DomController } from '../../index';

@Component({
  tag: 'ion-tabbar',
  host: {
    theme: 'tabbar'
  }
})
export class Tabbar {
  mode: string;
  color: string;

  @Element() el: HTMLElement;

  @State() canScrollLeft = false;
  @State() canScrollRight = false;

  @State() hidden = false;

  @Prop({ context: 'dom' }) dom: DomController;
  @Prop() placement = 'bottom';
  @Prop() selectedTab: HTMLIonTabElement;
  @Prop() scrollable: Boolean;
  @Prop() tabs: HTMLIonTabElement[];

  private scrollEl: HTMLIonScrollElement;

  @Watch('selectedTab')
  selectedTabChanged() {
    this.scrollable && this.scrollToSelectedButton();
    this.highlight && this.updateHighlight();
  }

  @Prop() layout = 'icon-top';
  @Prop() highlight = false;
  @Prop() translucent = false;

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

  @Listen('ionTabButtonDidLoad')
  @Listen('ionTabButtonDidUnload')
  onTabButtonLoad() {
    this.scrollable && this.updateBoundaries();
    this.highlight && this.updateHighlight();
  }

  protected analyzeTabs() {
    const tabs: HTMLIonTabButtonElement[] = Array.from(document.querySelectorAll('ion-tab-button')),
      scrollLeft: number = this.scrollEl.scrollLeft,
      tabsWidth: number = this.scrollEl.clientWidth;
    let previous: {tab: HTMLIonTabButtonElement, amount: number},
      next: {tab: HTMLIonTabButtonElement, amount: number};

    tabs.forEach((tab: HTMLIonTabButtonElement) => {
      const left: number = tab.offsetLeft,
        right: number = left + tab.offsetWidth;

      if (left < scrollLeft) {
        previous = {tab, amount: left};
      }

      if (!next && right > (tabsWidth + scrollLeft)) {
        const amount = right - tabsWidth;
        next = {tab, amount};
      }
    });

    return {previous, next};
  }

  private getSelectedButton(): HTMLIonTabButtonElement {
    return Array.from(this.el.querySelectorAll('ion-tab-button'))
      .find(btn => btn.selected);
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'tabbar-translucent') : {};

    const layoutClass = `layout-${this.layout}`;
    const placementClass = `placement-${this.placement}`;

    const hostClasses = {
      ...themedClasses,
      'tabbar-hidden': this.hidden,
      'scrollable': this.scrollable,
      [layoutClass]: true,
      [placementClass]: true
    };

    return {
      role: 'tablist',
      class: hostClasses
    };
  }

  render() {
    const selectedTab = this.selectedTab,
      ionTabbarHighlight = this.highlight ? <div class='animated tabbar-highlight'/> as HTMLElement : null,
      tabButtons = this.tabs.map(tab => <ion-tab-button tab={tab} selected={selectedTab === tab}/>);


    if (this.scrollable) {
      return [
        <ion-button onClick={() => this.scrollByTab('left')} fill='clear' class={{inactive: !this.canScrollLeft}}>
          <ion-icon name='arrow-dropleft'/>
        </ion-button>,
        <ion-scroll
          ref={(scrollEl: HTMLIonScrollElement) => {
            this.scrollEl = scrollEl;
          }}>
          {tabButtons}
          {ionTabbarHighlight}
        </ion-scroll>,
        <ion-button onClick={() => this.scrollByTab('right')} fill='clear' class={{inactive: !this.canScrollRight}}>
          <ion-icon name='arrow-dropright'/>
        </ion-button>
      ];
    } else {
      return [
        ...tabButtons,
        ionTabbarHighlight
      ];
    }
  }

  protected scrollToSelectedButton() {
    this.dom.read(() => {
      const activeTabButton: HTMLIonTabButtonElement = this.getSelectedButton();

      if (activeTabButton) {
        const scrollLeft: number = this.scrollEl.scrollLeft,
          tabsWidth: number = this.scrollEl.clientWidth,
          left: number = activeTabButton.offsetLeft,
          right: number = left + activeTabButton.offsetWidth;

        let amount;

        if (right > (tabsWidth + scrollLeft)) {
          amount = right - tabsWidth;
        } else if (left < scrollLeft) {
          amount = left;
        }

        if (amount !== undefined) {
          this.scrollEl.scrollToPoint(amount, 0, 250).then(() => {
            this.updateBoundaries();
          });
        }
      }
    });
  }

  scrollByTab(direction: 'left' | 'right') {
    this.dom.read(() => {
      const {previous, next} = this.analyzeTabs(),
        info = direction === 'right' ? next : previous,
        amount = info && info.amount;

      if (info) {
        this.scrollEl.scrollToPoint(amount, 0, 250).then(() => {
          this.updateBoundaries();
        });
      }
    });
  }

  updateBoundaries() {
    this.canScrollLeft = this.scrollEl.scrollLeft !== 0;
    this.canScrollRight = this.scrollEl.scrollLeft < (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth);
  }

  updateHighlight() {
    this.dom.read(() => {
      const btn = this.getSelectedButton(),
        ionTabbarHighlight: HTMLElement = this.highlight && this.el.querySelector('div.tabbar-highlight');

      if (btn && ionTabbarHighlight) {
        ionTabbarHighlight.style.transform = `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`;
      }
    });
  }
}
