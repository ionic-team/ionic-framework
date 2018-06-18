import { Component, Listen, Prop } from '@stencil/core';
import { Mode, SelectPopoverOption } from '../../interface';


@Component({
  tag: 'ion-select-popover',
  host: {
    theme: 'select-popover'
  }}
)
export class SelectPopover {
  mode!: Mode;

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
    option && option.handler && option.handler();
  }

  render() {
    return (
      <ion-list>
        { this.header ? <ion-list-header>{this.header}</ion-list-header> : null }
        { this.subHeader || this.message
          ? <ion-item text-wrap>
              <ion-label>
                { this.subHeader ? <h3>{this.subHeader}</h3> : null }
                { this.message ? <p>{this.message}</p> : null }
              </ion-label>
            </ion-item>
            : null}
        <ion-radio-group>
          {this.options.map(option =>
            <ion-item>
              <ion-label>
                {option.text}
              </ion-label>
              <ion-radio
                checked={option.checked}
                value={option.value}
                disabled={option.disabled}>
              </ion-radio>
            </ion-item>
          )}
        </ion-radio-group>
      </ion-list>
    );
  }
}


