import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-title',
  styleUrls: {
    ios: 'title.ios.scss',
    md: 'title.md.scss'
  },
  host: {
    theme: 'title'
  }
})
export class ToolbarTitle {

  @Prop() mode!: Mode;
  @Prop() color?: Color;

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'toolbar-title');

    return [
      <div class={themedClasses}>
        <slot></slot>
      </div>
    ];
  }
}
