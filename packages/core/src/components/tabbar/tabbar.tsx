import {Component, Element, Listen, Prop, PropDidChange, State} from '@stencil/core';
import {createThemedClasses} from '../../utils/theme';
import {getParentElement} from "../../utils/helpers";


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

  private scrollEl: HTMLIonScrollElement;
  @Prop({mutable: true}) private canScrollLeft: boolean = false;
  @Prop({mutable: true}) private canScrollRight: boolean = true;

  @State() hidden = false;

  @Prop() placement = 'bottom';
  @Prop() tabs: HTMLIonTabElement[];
  @Prop() selectedTab: HTMLIonTabElement;

  @PropDidChange('selectedTab')
  selectedTabChanged() {
    if (this.scrollOverflow) {
      this.scrollToActiveTab();
    }
  }

  @Prop() layout: string = 'icon-top';
  @Prop() highlight: boolean = false;
  @Prop() translucent: boolean = false;
  @Prop({mutable: true}) scrollOverflow: boolean = true;

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

  protected analyzeTabs() {
    const tabs: HTMLIonTabButtonElement[] = Array.from(document.querySelectorAll('ion-tab-button')),
      scrollLeft: number = this.scrollEl.scrollLeft,
      tabsWidth: number = this.scrollEl.clientWidth;
    let previous: any = null,
      next: any = null;

    tabs.forEach((tab: HTMLIonTabButtonElement) => {
      const left: number = tab.offsetLeft,
        right: number = left + tab.offsetWidth;

      if (left < scrollLeft) {
        previous = {tab, amount: left};
      }

      if (!next && right > (tabsWidth + scrollLeft)) {
        let amount = right - tabsWidth;
        // let amount = left;
        next = {tab, amount};
      }
    });

    return {previous, next};
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'tabbar-translucent') : {};

    const layoutClass = `layout-${this.layout}`;
    const placementClass = `placement-${this.placement}`;

    const hostClasses = {
      ...themedClasses,
      'tabbar-hidden': this.hidden,
      'scroll-overflow': this.scrollOverflow,
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
      tabs = this.tabs.map(tab => (
        <ion-tab-button
          tab={tab}
          selected={selectedTab === tab}>
        </ion-tab-button>
      ));

    if (this.scrollOverflow) {
      return [
        <ion-button onClick={() => this.scrollByTab('left')} fill="clear" class={{inactive: !this.canScrollLeft}}>
          <ion-icon name="arrow-back"></ion-icon>
        </ion-button>,
        <ion-scroll
          ref={(scrollEl: HTMLIonScrollElement) => {
            this.scrollEl = scrollEl;
          }}>
          {tabs}
          {this.highlight ?
            <ion-tab-highlight selectedTab={selectedTab}></ion-tab-highlight>
            : null
          }
        </ion-scroll>,
        <ion-button onClick={() => this.scrollByTab('right')} fill="clear" class={{inactive: !this.canScrollRight}}>
          <ion-icon name="arrow-forward"></ion-icon>
        </ion-button>,
      ]
    } else {
      const dom = tabs;
      if (this.highlight) {
        dom.push(<ion-tab-highlight selectedTab={selectedTab}></ion-tab-highlight>);
      }
      return dom;
    }
  }

  protected scrollToActiveTab() {
    Context.dom.read(() => {
      const parent = getParentElement(this.el) as HTMLElement,
        tabButton: HTMLIonTabButtonElement = Array.from(parent.querySelectorAll('ion-tab-button'))
          .find(btn => btn.selected);

      if (tabButton) {
        const scrollLeft: number = this.scrollEl.scrollLeft,
          tabsWidth: number = this.scrollEl.clientWidth,
          left: number = tabButton.offsetLeft,
          right: number = left + tabButton.offsetWidth;

        let amount;

        if (right > (tabsWidth + scrollLeft)) {
          amount = right - tabsWidth;

          this.canScrollLeft = true;
        } else if (left < scrollLeft) {
          amount = left;
        }

        if (amount !== undefined) {
          this.canScrollLeft = amount !== 0;
          this.canScrollRight = amount > (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth);
          this.scrollEl.scrollToPoint(amount, 0, 250);
        }
      }
    });
  }

  scrollByTab(direction: 'left' | 'right') {
    Context.dom.read(() => {
      const {previous, next} = this.analyzeTabs(),
        amount = (direction === 'right'&& next && next.amount) || (direction === 'left' && previous && previous.amount);

      if (amount !== false) {
        this.scrollEl.scrollToPoint(amount, 0, 250);

        console.log(amount, (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth));
        this.canScrollLeft = amount !== 0;
        this.canScrollRight = amount < (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth)
      }
    });
  }
}
