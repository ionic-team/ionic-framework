import { BooleanInputComponent, GestureDetail } from '../../util/interfaces';
import { Component, h, Ionic, Listen, Prop, Watch } from '../index';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    wp: 'toggle.wp.scss'
  },
  shadow: false
})
export class Toggle implements BooleanInputComponent {
  activated: boolean;
  hasFocus: boolean;
  id: string;
  labelId: string;
  startX: number;

  @Prop() checked: boolean;
  @Prop() disabled: boolean;
  @Prop() value: string;


  @Watch('checked')
  changed(val: boolean) {
    Ionic.emit(this, 'ionChange', { detail: { checked: val } });
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
      Ionic.emit(this, 'ionFocus');
    }
  }


  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      Ionic.emit(this, 'ionBlur');
    }
  }


  render() {
    return h(this,
      h('ion-gesture', Ionic.theme(this, 'toggle', {
        class: {
          'toggle-activated': this.activated,
          'toggle-checked': this.checked,
          'toggle-disabled': this.disabled,
        },
        props: {
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
        }
      }),
        [
          h('div.toggle-icon',
            h('div.toggle-inner')
          ),
          h('div.toggle-cover', {
            attrs: {
              'id': this.id,
              'aria-checked': this.checked ? 'true' : false,
              'aria-disabled': this.disabled ? 'true' : false,
              'aria-labelledby': this.labelId,
              'role': 'checkbox',
              'tabindex': 0
            }
          })
        ]
      )
    );
  }

}
