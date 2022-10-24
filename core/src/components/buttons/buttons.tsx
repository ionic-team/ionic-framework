import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss',
  },
  scoped: true,
})
export class Buttons implements ComponentInterface {
  /**
   * If true, buttons will disappear when its
   * parent toolbar has fully collapsed if the toolbar
   * is not the first toolbar. If the toolbar is the
   * first toolbar, the buttons will be hidden and will
   * only be shown once all toolbars have fully collapsed.
   *
   * Only applies in `ios` mode with `collapse` set to
   * `true` on `ion-header`.
   *
   * Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)
   */
  @Prop() collapse = false;

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          ['buttons-collapse']: this.collapse,
        }}
      ></Host>
    );
  }
}
