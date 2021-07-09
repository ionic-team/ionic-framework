import { Component, Host, h, Prop, Method, Element } from '@stencil/core';
import { Color } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-accordion',
  styleUrl: 'med-accordion.scss',
  shadow: true,
})
export class MedAccordion {
  @Element() el!: HTMLElement;
  @Prop() color?: Color;
  @Prop() size?: 'full';
  @Prop({ reflect: true, mutable: true }) collapsed = true;

  private contentEl!: HTMLDivElement;
  private contentFakeEl!: HTMLDivElement;
  private fakeHeight!: number;

  componentDidLoad() {
    this.contentEl.style.maxHeight = '0';
    this.fakeHeight = this.contentFakeEl.scrollHeight;
  }

  @Method()
  async toggle() {
    this.expandContent();
  }

  onClick = () => {
    this.expandContent();
  }

  private expandContent = async () => {
    if (this.collapsed) {
      this.contentFakeEl.style.display = 'block';
      this.fakeHeight = this.contentFakeEl.scrollHeight;
      this.collapsed = !this.collapsed;
      this.contentEl.style.maxHeight = `${this.fakeHeight}px`;
      this.contentFakeEl.style.maxHeight = '0';
      this.contentEl.style.maxHeight = `${this.contentEl.scrollHeight}px`;
      this.contentEl.style.transition = 'max-height 0.2s ease-out';
    } else {
      this.contentFakeEl.style.display = 'none';
      this.contentFakeEl.style.maxHeight = `${this.fakeHeight}px`;
      this.contentEl.style.maxHeight = `${this.fakeHeight}px`;
      await this.sleep(200);
      this.contentEl.style.transition = 'unset';
      this.contentEl.style.maxHeight = '0px';
      this.contentFakeEl.style.display = 'block';
      this.collapsed = !this.collapsed;
    }
  }

  private sleep = async (timeout: number) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    })
  }

  render() {
    const {color, size} = this;
    return (
      <Host from-stencil class={createColorClasses(color, {
        'med-accordion--full': size !== undefined,
        'med-accordion--collapsed': this.collapsed,
        })}>
        <div class="med-accordion__header" onClick={this.onClick}>
          <slot name="header"></slot>
          <ion-icon class="med-accordion__icon" name="med-arrow-down"></ion-icon>
        </div>

        <div class="med-accordion__content--fake" ref={(el) => this.contentFakeEl = el as HTMLDivElement}>
          <slot name="content-fake"></slot>
        </div>

        <div class="med-accordion__content" ref={(el) => this.contentEl = el as HTMLDivElement}>
          <slot name="content"></slot>
        </div>

      </Host>
    );
  }

}
