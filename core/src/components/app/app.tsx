import type { ComponentInterface } from '@stencil/core';
import { Build, Component, Element, Host, Method, h } from '@stencil/core';
import type { FocusVisibleUtility } from '@utils/focus-visible';

import { config } from '../../global/config';
import { getIonTheme, rIC } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss',
})
export class App implements ComponentInterface {
  private focusVisible?: FocusVisibleUtility;

  @Element() el!: HTMLElement;

  componentDidLoad() {
    // TODO can we move focus visible to global
    if (Build.isBrowser) {
      rIC(async () => {
        import('../../utils/focus-visible').then((module) => (this.focusVisible = module.startFocusVisible()));
      });
    }
  }

  /**
   * @internal
   * Used to set focus on an element that uses `ion-focusable`.
   * Do not use this if focusing the element as a result of a keyboard
   * event as the focus utility should handle this for us. This method
   * should be used when we want to programmatically focus an element as
   * a result of another user action. (Ex: We focus the first element
   * inside of a popover when the user presents it, but the popover is not always
   * presented as a result of keyboard action.)
   */
  @Method()
  async setFocus(elements: HTMLElement[]) {
    if (this.focusVisible) {
      this.focusVisible.setFocus(elements);
    }
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
