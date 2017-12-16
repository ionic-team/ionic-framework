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
  @State() canScrollLeft: boolean = false;
  @State() canScrollRight: boolean = false;

  @State() hidden = false;

  @Prop() placement = 'bottom';
  @Prop() tabs: HTMLIonTabElement[];
  @Prop() selectedTab: HTMLIonTabElement;
  @Prop() scrollable:Boolean;

  @PropDidChange('selectedTab')
  selectedTabChanged() {
    if (this.scrollable) {
      this.scrollToActiveTab();
    }
  }

  @Prop() layout: string = 'icon-top';
  @Prop() highlight: boolean = false;
  @Prop() translucent: boolean = false;

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

  @Listen('ionTabButtonDidLoad')
  onTabButtonLoad() {
    this.updateBoundaries();
  }

  @Listen('ionTabButtonDidUnload')
  onTabButtonUnload() {
    this.updateBoundaries();
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
        let amount = right - tabsWidth;
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
      ionTabHighlight = <ion-tab-highlight selectedTab={selectedTab}/>,
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
          {this.highlight ? ionTabHighlight : null}
        </ion-scroll>,
        <ion-button onClick={() => this.scrollByTab('right')} fill='clear' class={{inactive: !this.canScrollRight}}>
          <ion-icon name='arrow-dropright'/>
        </ion-button>
      ]
    } else {
      return [
        ...tabButtons,
        this.highlight ? ionTabHighlight : null
      ]
    }
  }

  protected scrollToActiveTab() {
    Context.dom.read(async () => {
      const parent = getParentElement(this.el) as HTMLElement,
        activeTabButton: HTMLIonTabButtonElement = Array.from(parent.querySelectorAll('ion-tab-button'))
          .find(btn => btn.selected);

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
          await this.scrollEl.scrollToPoint(amount, 0, 250);
          this.updateBoundaries();
        }
      }
    });
  }

  scrollByTab(direction: 'left' | 'right') {
    Context.dom.read(async () => {
      const {previous, next} = this.analyzeTabs(),
        info = direction === 'right' ? next : previous,
        amount = info && info.amount;

      if (info) {
        await this.scrollEl.scrollToPoint(amount, 0, 250);
        this.updateBoundaries();
      }
    });
  }

  updateBoundaries() {
    this.canScrollLeft = this.scrollEl.scrollLeft != 0;
    this.canScrollRight = this.scrollEl.scrollLeft < (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth);
  }
}
