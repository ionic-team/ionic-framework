import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'med-tooltip',
  styleUrl: 'med-tooltip.scss',
  shadow: true,
})
export class MedTooltip {
  @Prop({ reflect: true }) header!: string;
  @Prop({ reflect: true }) content!: string;
  @Prop({ reflect: true }) buttonLeft!: { label: string, icon: string };
  @Prop({ reflect: true }) buttonRight!: { label: string, icon: string };

  render() {
    let buttonContainer;
    let buttonRightEl;
    let buttonLeftEl;
    const { header, content, buttonLeft, buttonRight } = this;
    const simple = !header && !buttonLeft && !buttonRight && content && content.split(' ').length <= 3;

    if (buttonLeft && buttonLeft.icon) {
      buttonLeftEl = (
        <ion-button ds-name="icon-only">
          <ion-icon slot="icon-only" name={buttonLeft.icon}></ion-icon>
        </ion-button>
      );
    } else if (buttonLeft && buttonLeft.label) {
      buttonLeftEl = (
        <button class="button button--left">{buttonLeft.label}</button>
      );
    } else {
      buttonLeftEl = '';
    }

    if (buttonRight && buttonRight.icon) {
      console.log(buttonRight.icon);

      buttonRightEl = (
        <ion-button ds-name="icon-only">
          <ion-icon slot="icon-only" name={buttonRight.icon}></ion-icon>
        </ion-button>
      );
    } else if (buttonRight && buttonRight.label) {
      buttonRightEl = (
        <button class="button button--right">{buttonRight.label}</button>
      );
    } else {
      buttonRightEl = '';
    }

    if (buttonLeft || buttonRight) {
      buttonContainer = (
        <div class="button-container">
          {buttonLeftEl}

          {buttonRightEl}
        </div>
      );
    }

    return (
      <Host from-stencil class={{'simple': simple }}>
        { header && <h4 class="header">{header}</h4> }
        { content && <p class="content">{content}</p> }

        { buttonContainer }
      </Host>
    );
  }

}
