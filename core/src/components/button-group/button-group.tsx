import type { ComponentInterface , EventEmitter} from '@stencil/core';
import { Component, Host, Prop, h, Element, State, Event, Watch } from '@stencil/core';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';


/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-button-group',
  styleUrls: {
    ios: 'button-group.ionic.scss',
    md: 'button-group.ionic.scss',
    ionic: 'button-group.ionic.scss',
  },
  scoped: true,
})
export class ButtonGroup implements ComponentInterface {
  @Element() el!: HTMLElement;

  @State() activeIndex: number = 0;

  @Prop({ reflect: true, mutable: true }) fill?: 'outline' | 'solid';

  @Prop({ reflect: true }) shape?: 'soft' | 'round' | 'rectangular';

  @Prop({ reflect: true }) size?: 'small' | 'default' | 'large';
  
  @Prop({ reflect: true }) color?: Color;

  /**
   * The value of the currently selected button.
   */
  @Prop({ mutable: true, reflect: true }) value: string | number | null = null;

  /**
   * Emitted when the active button changes.
   */
  @Event() ionChange!: EventEmitter<{ value: string | number | null; activeIndex: number }>;

  @Event() ionValueChange!: EventEmitter<{ value: string | number | null}>;
  
    @Watch('value')
    valueChanged(value: any | undefined) {
        this.ionValueChange.emit({ value });
    }

  private getButtons(): HTMLIonButtonElement[] {
    return Array.from(this.el.querySelectorAll('ion-button'));
  }

  private handleButtonClick(index: number, value: string | number | null) {
    this.activeIndex = index;
    this.value = value;
    this.ionChange.emit({ value, activeIndex: index });
  }

  private renderActiveIndicator() {
    const buttons = this.getButtons();

    const indicatorStyle = {
      width: `${100 / buttons.length}%`,
      transform: `translateX(${this.activeIndex * 100}%)`,
    };

    return <div class="active-indicator" style={indicatorStyle} />;
  }

  componentWillLoad() {
    // Initialize the active button based on the value prop
    const buttons = Array.from(this.el.querySelectorAll('ion-button'));
    const initialIndex = buttons.findIndex((button) => button.getAttribute('value') === `${this.value}`);
    if (initialIndex !== -1) {
      this.activeIndex = initialIndex;
    }
  }

  render() {
    const {color, size, shape, fill} = this;
    const theme = getIonTheme(this);
    const buttons = this.getButtons();

    return (
      <Host
        class={createColorClasses(color, {
          [theme]: true,
          [`button-group-${size}`]: size !== undefined,
          [`button-group-${shape}`]: true,
          [`button-group-${fill}`]: true,
          'in-toolbar': hostContext('ion-toolbar', this.el)
        })}
      >
        {this.renderActiveIndicator()}
        <slot></slot>
        {buttons.map((button, index) => {
          button.fill = 'clear';
          button.shape = shape;
          button.size = size;
          button.onclick = () => this.handleButtonClick(index, button.getAttribute('value'));
          button.classList.toggle('active', index === this.activeIndex);
          button.setAttribute('aria-pressed', index === this.activeIndex ? 'true' : 'false');
        })}
      </Host>
    );
  }
}