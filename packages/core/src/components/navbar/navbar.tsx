import { Component, Element, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { Config } from '../../index';


@Component({
  tag: 'ion-navbar',
  host: {
    theme: 'toolbar'
  }
})
export class Navbar {
  @Element() private el: HTMLElement;
  mode: string;
  color: string;

  @Prop({ context: 'config' }) config: Config;
  @Prop() hideBackButton = false;
  @Prop() backButtonText: string;
  @Prop() backButtonIcon: string;
  @Prop() hidden = false;

  backButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  componentDidLoad() {
    const buttons = this.el.querySelectorAll('ion-button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('button-type', 'bar-button');
    }
  }

  hostData() {
    return {
      class: {
        'statusbar-padding': this.config.getBoolean('statusbarPadding')
      }
    };
  }

  render() {
    const backButtonIcon = this.backButtonIcon || this.config.get('backButtonText', 'Back');
    const backButtonText = this.backButtonText || this.config.get('backButtonIcon', 'Back');

    const backgroundCss = createThemedClasses(this.mode, this.color, 'toolbar-background');
    const contentCss = createThemedClasses(this.mode, this.color, 'toolbar-content');
    const backButtonCss = createThemedClasses(this.mode, this.color, 'back-button');
    const backButtonIconCss = createThemedClasses(this.mode, this.color, 'back-button-icon');
    const backButtonTextCss = createThemedClasses(this.mode, this.color, 'back-button-text');

    return [
      <div class={backgroundCss}></div>,
      <button onClick={this.backButtonClick.bind(this)} class={backButtonCss} hidden={this.hideBackButton}>
        { backButtonIcon
          ? <ion-icon class={backButtonIconCss} name={backButtonIcon}></ion-icon>
          : null
        }
        <span class={backButtonTextCss}>{backButtonText}</span>
      </button>,
      <slot name='start'></slot>,
      <slot name='mode-start'></slot>,
      <slot name='mode-end'></slot>,
      <slot name='end'></slot>,
      <div class={contentCss}>
        <slot></slot>
      </div>
    ];
  }
}
