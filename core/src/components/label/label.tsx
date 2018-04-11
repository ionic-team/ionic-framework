import { Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';

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

  @Element() private el: HTMLElement;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * The position determines where and how the label behaves inside an item.
   * Possible values are: 'inline' | 'fixed' | 'stacked' | 'floating'
   */
  @Prop({mutable: true}) position: 'inline' | 'fixed' | 'stacked' | 'floating' | undefined;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  @Method()
  getText(): string {
    return this.el.textContent || '';
  }

  componentWillLoad() {
    if (this.position === undefined) {
      this.position = (this.mode === 'ios') ? 'inline' : 'floating';
    }
  }

  componentDidLoad() {
    this.positionChanged();
  }

  @Watch('position')
  positionChanged() {
    return this.ionStyle.emit({
      [`label-${this.position}`]: true,
    });
  }

  hostData() {
    return {
      class: {
        [`label-${this.position}`]: true,
        [`label-${this.mode}-${this.position}`]: true
      }
    };
  }
}
