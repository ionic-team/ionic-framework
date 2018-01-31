import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { Config } from '../../index';


@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  },
  host: {
    theme: 'back-button'
  }
})
export class BackButton {
  private mode: string;

  @Prop({ context: 'config' }) config: Config;

  @Event() ionNavPop: EventEmitter;

  onClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.ionNavPop.emit();
  }

  render() {
    const iconName = this.config.get('backButtonIcon', this.mode + '-arrow-back');
    const text = this.config.get('backButtonText', 'Back');

    const iconClass: any = {
      'back-button-icon': true
    };
    const textClass: any = {
      'back-button-text': true
    };

    if (this.mode) {
      iconClass['back-button-icon-' + this.mode] = true;
      iconClass['back-button-text-' + this.mode] = true;
    }

    return (
      <button onClick={this.onClick.bind(this)}>
        <span class={iconClass}>
          <slot name='icon'>
            <ion-icon name={iconName}></ion-icon>
          </slot>
        </span>
        <span class={textClass}>
          <slot name='text'>
            {text}
          </slot>
        </span>
      </button>
    );
  }
}
