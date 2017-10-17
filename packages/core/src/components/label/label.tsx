import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss',
    wp: 'label.wp.scss'
  },
  host: {
    theme: 'label'
  }
})
export class Label {
  styleTmr: any;

  @Element() el: HTMLElement;

  /**
   * @output {event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {event} If true, the label will sit alongside an input. Defaults to `false`.
   */
  @Prop() fixed: boolean = false;

  /**
   * @output {event} If true, the label will float above an input when the value is empty or the input is focused. Defaults to `false`.
   */
  @Prop() floating: boolean = false;

  /**
   * @output {event} If true, the label will be stacked above an input. Defaults to `false`.
   */
  @Prop() stacked: boolean = false;

  /**
   * @hidden
   */
  @Method()
  getText(): string {
    return this.el.textContent || '';
  }

  protected ionViewDidLoad() {
    this.emitStyle();
  }

  emitStyle() {
    clearTimeout(this.styleTmr);

    let styles = {
      'label-fixed': this.fixed,
      'label-floating': this.floating,
      'label-stacked': this.stacked
    };

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit(styles);
    });
  }

  protected render() {
    return <slot></slot>;
  }
}
