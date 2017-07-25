import { Component, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';
import { BooleanInputComponent, GestureDetail } from '../../index';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    wp: 'toggle.wp.scss'
  },
  host: {
    theme: 'toggle'
  }
})
export class Toggle implements BooleanInputComponent {
  activated: boolean = false;
  hasFocus: boolean = false;
  id: string;
  labelId: string;
  startX: number;
  styleTmr: any;

  @Event() ionChange: EventEmitter;
  @Event() ionStyle: EventEmitter;
  @Event() ionFocus: EventEmitter;
  @Event() ionBlur: EventEmitter;

  @Prop() color: string;
  @Prop() mode: string;

  @Prop({ state: true }) checked: boolean = false;
  @Prop({ state: true }) disabled: boolean = false;
  @Prop({ state: true }) value: string;


  ionViewWillLoad() {
    this.emitStyle();
  }

  @PropDidChange('checked')
  changed(val: boolean) {
    this.ionChange.emit({ checked: val });
    this.emitStyle();
  }

  @PropDidChange('disabled')
  disableChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        'toggle-disabled': this.disabled,
        'toggle-checked': this.checked,
        'toggle-activated': this.activated,
        'toggle-focus': this.hasFocus
      });
    });
  }

  private canStart() {
    return !this.disabled;
  }


  private onDragStart(detail: GestureDetail) {
    this.startX = detail.startX;
    this.fireFocus();
  }


  private onDragMove(detail: GestureDetail) {
    if (this.checked) {
      if (detail.currentX + 15 < this.startX) {
        this.checked = false;
        this.activated = true;
        this.startX = detail.currentX;
      }

    } else if (detail.currentX - 15 > this.startX) {
      this.checked = true;
      this.activated = (detail.currentX < this.startX + 5);
      this.startX = detail.currentX;
    }
  }


  private onDragEnd(detail: GestureDetail) {
    if (this.checked) {
      if (detail.startX + 4 > detail.currentX) {
        this.checked = false;
      }

    } else if (detail.startX - 4 < detail.currentX) {
      this.checked = true;
    }

    this.activated = false;
    this.fireBlur();
    this.startX = null;
  }


  @Listen('keydown.space')
  onSpace(ev: KeyboardEvent) {
    this.toggle();
    ev.stopPropagation();
    ev.preventDefault();
  }

  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.fireFocus();
    }
    return this.checked;
  }


  fireFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  }


  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  hostData() {
    return {
      class: {
        'toggle-activated': this.activated,
        'toggle-checked': this.checked,
        'toggle-disabled': this.disabled
      }
    };
  }

  render() {
    return (
      <ion-gesture props={{
        'canStart': this.canStart.bind(this),
        'onStart': this.onDragStart.bind(this),
        'onMove': this.onDragMove.bind(this),
        'onEnd': this.onDragEnd.bind(this),
        'onPress': this.toggle.bind(this),
        'gestureName': 'toggle',
        'gesturePriority': 30,
        'type': 'pan,press',
        'direction': 'x',
        'threshold': 20,
        'attachTo': 'parent'
      }}>
        <div class='toggle-icon'>
          <div class='toggle-inner'></div>
        </div>
        <div
          class='toggle-cover'
          id={this.id}
          aria-checked={this.checked ? 'true' : false}
          aria-disabled={this.disabled ? 'true' : false}
          aria-labelledby={this.labelId}
          role='checkbox'
          tabIndex={0}
        >
        </div>
      </ion-gesture>
    );
  }
}
