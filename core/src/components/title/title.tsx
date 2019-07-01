import { Component, ComponentInterface, Element, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-title',
  styleUrl: 'title.scss',
  shadow: true
})
export class ToolbarTitle implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  private getMode() {
    const mode = getIonMode(this);
    const toolbar = this.el.closest('ion-toolbar');
    return (toolbar && toolbar.mode) || mode;
  }

  hostData() {
    const mode = this.getMode();

    return {
      class: {
        [mode]: true,
        [`title-${mode}`]: true,

        ...createColorClasses(this.color),
      }
    };
  }

  render() {
    return [
      <div class="toolbar-title">
        <slot></slot>
      </div>
    ];
  }
}
