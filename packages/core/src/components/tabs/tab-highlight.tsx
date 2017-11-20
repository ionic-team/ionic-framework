import { Component, Element, Listen, Prop, PropDidChange, State } from '@stencil/core';
import { getParentElement } from '../../utils/helpers';

@Component({
  tag: 'ion-tab-highlight'
})
export class TabHighlight {

  @Element() private el: HTMLElement;

  @State() animated = false;
  @State() transform = '';

  @Prop() selectedTab: HTMLIonTabElement;
  @PropDidChange('selectedTab')
  selectedTabChanged() {
    this.updateTransform();
  }

  @Listen('window:resize')
  onResize() {
    this.updateTransform();
  }

  componentDidLoad() {
    this.updateTransform();
  }

  protected updateTransform() {
    Context.dom.read(() => {
      const btn = this.getSelectedButton();
      this.transform = (btn)
        ? `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`
        : '';
      if (!this.animated) {
        setTimeout(() => this.animated = true, 80);
      }
    });
  }

  private getSelectedButton(): HTMLIonTabButtonElement {
    const parent = getParentElement(this.el) as HTMLElement;
    if (!parent) {
      return null;
    }
    return Array.from(parent.querySelectorAll('ion-tab-button'))
      .find(btn => btn.selected);
  }

  hostData() {
    return {
      style: {
        'transform': this.transform
      },
      class: {
        'animated': this.animated,
      }
    };
  }
}
