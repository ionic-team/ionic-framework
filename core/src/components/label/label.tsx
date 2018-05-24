import { Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';
import { Color, Mode, StyleEvent } from '../../interface';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss'
  }
})
export class Label {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  /**
   * The position determines where and how the label behaves inside an item.
   * Possible values are: 'inline' | 'fixed' | 'stacked' | 'floating'
   */
  @Prop() position?: 'fixed' | 'stacked' | 'floating';


  @Prop() text?: string;
  @Prop() labelfor?: string;

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
      [`label-${position}`]: !!position,
    });
  }

  protected render() {

    const TagType = 'label';
    const position = this.position;
    const labelClasses = {
      [`label-${position}`]: !!position,
      [`label-${this.mode}-${position}`]: !!position
    };

    return (
      <TagType
        class={labelClasses}
        htmlFor={this.labelfor}
      >
        {this.text}
      </TagType>
    );
  }

}
