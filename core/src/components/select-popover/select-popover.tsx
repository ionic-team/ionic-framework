import { Component, ComponentInterface, Listen, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { SelectPopoverOption } from '../../interface';
import { safeCall } from '../../utils/overlays';

/**
 * @internal
 */
@Component({
  tag: 'ion-select-popover',
  styleUrl: 'select-popover.scss',
  scoped: true
})
export class SelectPopover implements ComponentInterface {

  /** Header text for the popover */
  @Prop() header?: string;

  /** Subheader text for the popover */
  @Prop() subHeader?: string;

  /** Text for popover body */
  @Prop() message?: string;

  /** Array of options for the popover */
  @Prop() options: SelectPopoverOption[] = [];

  @Listen('ionSelect')
  onSelect(ev: any) {
    const option = this.options.find(o => o.value === ev.target.value);
    if (option) {
      safeCall(option.handler);
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
    return (
      <ion-list>
        {this.header !== undefined && <ion-list-header>{this.header}</ion-list-header>}
        { (this.subHeader !== undefined || this.message !== undefined) &&
          <ion-item>
            <ion-label text-wrap>
              {this.subHeader !== undefined && <h3>{this.subHeader}</h3>}
              {this.message !== undefined && <p>{this.message}</p>}
            </ion-label>
          </ion-item>
        }
        <ion-radio-group>
          {this.options.map(option =>
            <ion-item>
              <ion-label>
                {option.text}
              </ion-label>
              <ion-radio
                checked={option.checked}
                value={option.value}
                disabled={option.disabled}
              >
              </ion-radio>
            </ion-item>
          )}
        </ion-radio-group>
      </ion-list>
    );
  }
}
