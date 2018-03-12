import { Component, Listen, Prop } from '@stencil/core';


export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  handler?: Function;
}

@Component({
  tag: 'ion-select-popover',
  host: {
    theme: 'select-popover'
  }}
)
export class SelectPopover {
  private mode: string;

  @Prop() title: string;

  @Prop() subTitle: string;

  @Prop() message: string;

  @Prop() options: SelectPopoverOption[] = [];

  @Listen('ionSelect')
  onSelect(ev: any) {
    const option = this.options.find(o => o.value === ev.target.value);
    option && option.handler && option.handler();
  }

  render() {
    return (
      <ion-list no-lines={this.mode === 'md'}>
        { this.title ? <ion-list-header>{this.title}</ion-list-header> : null }
        { this.subTitle || this.message
          ? <ion-item>
              <ion-label>
                { this.subTitle ? <h3>{this.subTitle}</h3> : null }
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


