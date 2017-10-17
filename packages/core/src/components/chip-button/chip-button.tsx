import { Component, CssClassMap, Element, Prop } from '@stencil/core';

import { getElementClassObject } from '../../utils/theme';

@Component({
  tag: 'ion-chip-button',
  styleUrls: {
    ios: 'chip-button.ios.scss',
    md: 'chip-button.md.scss',
    wp: 'chip-button.wp.scss'
  },
})
export class ChipButton {
  @Element() private el: HTMLElement;
  private mode: string;
  private color: string;

  @Prop() href: string;

  /**
   * @Prop {boolean} If true, activates a transparent button style.
   */
  @Prop() clear: boolean = false;

  /**
   * @Prop {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * @hidden
   * Get the classes based on the button type
   * e.g. alert-button, action-sheet-button
   */
  private getButtonClassList(buttonType: string, mode: string): string[] {
    if (!buttonType) {
      return [];
    }
    return [
      buttonType,
      `${buttonType}-${mode}`
    ];
  }

  /**
   * @hidden
   * Get the classes for the color
   */
  private getColorClassList(color: string, buttonType: string, style: string, mode: string): string[] {
    let className = (style === 'default') ? `${buttonType}` : `${buttonType}-${style}`;

    return [`${className}-${mode}`].concat(
        style !== 'default' ? `${className}` : [],
        color ? `${className}-${mode}-${color}` : []
      );
  }

  /**
   * @hidden
   * Get the classes for the style
   * Chip buttons can only be clear or default (solid)
   */
  private getStyleClassList(buttonType: string): string[] {
    let classList = [].concat(
      this.clear ? this.getColorClassList(this.color, buttonType, 'clear', this.mode) : []
    );

    if (classList.length === 0) {
      classList = this.getColorClassList(this.color, buttonType, 'default', this.mode);
    }

    return classList;
  }

  protected render() {
    const buttonType = 'chip-button';

    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        this.getButtonClassList(buttonType, this.mode),
        this.getStyleClassList(buttonType)
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType class={buttonClasses} disabled={this.disabled}>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
