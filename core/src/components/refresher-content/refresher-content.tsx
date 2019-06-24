import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { SpinnerTypes } from '../../interface';
import { sanitizeDOMString } from '../../utils/sanitization';

@Component({
  tag: 'ion-refresher-content'
})
export class RefresherContent implements ComponentInterface {

  /**
   * A static icon to display when you begin to pull down
   */
  @Prop({ mutable: true }) pullingIcon?: string | null;

  /**
   * The text you want to display when you begin to pull down.
   * `pullingText` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   */
  @Prop() pullingText?: string;

  /**
   * An animated SVG spinner that shows when refreshing begins
   */
  @Prop({ mutable: true }) refreshingSpinner?: SpinnerTypes | null;

  /**
   * The text you want to display when performing a refresh.
   * `refreshingText` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   */
  @Prop() refreshingText?: string;

  componentWillLoad() {
    if (this.pullingIcon === undefined) {
      this.pullingIcon = config.get('refreshingIcon', 'arrow-down');
    }
    if (this.refreshingSpinner === undefined) {
      const mode = getIonMode(this);
      this.refreshingSpinner = config.get(
        'refreshingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'crescent')
      );
    }
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [mode]: true,
      }
    };
  }

  render() {
    return [
      <div class="refresher-pulling">
        {this.pullingIcon &&
          <div class="refresher-pulling-icon">
            <ion-icon icon={this.pullingIcon} lazy={false}></ion-icon>
          </div>
        }
        {this.pullingText &&
          <div class="refresher-pulling-text" innerHTML={sanitizeDOMString(this.pullingText)}></div>
        }
      </div>,
      <div class="refresher-refreshing">
        {this.refreshingSpinner &&
          <div class="refresher-refreshing-icon">
            <ion-spinner name={this.refreshingSpinner}></ion-spinner>
          </div>
        }
        {this.refreshingText &&
          <div class="refresher-refreshing-text" innerHTML={sanitizeDOMString(this.refreshingText)}></div>
        }
      </div>
    ];
  }
}
