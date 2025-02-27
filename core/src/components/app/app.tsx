import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Method, h } from '@stencil/core';
import { focusElements } from '@utils/focus-visible';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss',
})
export class App implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * Sets focus on elements that use `ion-focusable`.
   *
   * @param elements - The elements to set focus on.
   */
  @Method()
  async setFocus(elements: HTMLElement[]) {
    /**
     * The focus-visible utility is used to set focus on an
     * element that uses `ion-focusable`.
     */
    focusElements(elements);
  }

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,
          'ion-page': true,
          'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
        }}
      ></Host>
    );
  }
}
