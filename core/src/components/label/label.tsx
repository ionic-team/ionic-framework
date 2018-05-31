import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch
} from '@stencil/core';
import { Color, Mode, StyleEvent } from '../../interface';

@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss'
  },
  host: {
    theme: 'label'
  }
})
export class Label {
  @Element() el!: HTMLElement;

  /**
   * The color to use for the label's text
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The position determines where and how the label behaves inside an item.
   * Possible values are: 'inline' | 'fixed' | 'stacked' | 'floating'
   */
  @Prop() position?: 'fixed' | 'stacked' | 'floating';

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  @Method()
  getText(): string {
    return this.el.textContent || '';
  }

  componentDidLoad() {
    this.positionChanged();
  }

  @Watch('position')
  positionChanged() {
    const position = this.position;
    return this.ionStyle.emit({
      [`label-${position}`]: !!position
    });
  }

  hostData() {
    const position = this.position;
    return {
      class: {
        [`label-${position}`]: !!position,
        [`label-${this.mode}-${position}`]: !!position
      }
    };
  }
}
