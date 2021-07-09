import { Component, Host, h, Prop, Method, Element, State, Watch } from '@stencil/core';
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
  @Prop({ reflect: true }) icon?: 'left' | 'right';
  @Prop({ reflect: true, mutable: true }) collapsed = true;
  @State() collapsedState = true;

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

  @Watch('collapsed')
  collapsedChanged() {
    this.expandContent();
  }

  onClick = () => {
    this.expandContent();
  }

  private expandContent = async () => {
    if (this.collapsedState) {
      this.contentFakeEl.style.display = 'block';
      this.fakeHeight = this.contentFakeEl.scrollHeight;
      this.collapsedState = !this.collapsedState;
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
      this.collapsedState = !this.collapsedState;
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
    const {color, size, collapsedState: collapsed, icon} = this;
    return (
      <Host from-stencil class={createColorClasses(color, {
        'med-accordion--full': size !== undefined,
        'med-accordion--collapsed': collapsed,
        })}>
        <div class="med-accordion__header" onClick={this.onClick}>
          {icon === 'left' && <div class="med-accordion__icon-container med-accordion__icon-container--left">
             <ion-icon class="med-accordion__icon" name="med-arrow-down"></ion-icon>
          </div>}

          <slot name="header"></slot>

          {(!icon || icon === 'right') && <div class="med-accordion__icon-container med-accordion__icon-container--right">
            <ion-icon class="med-accordion__icon" name="med-arrow-down"></ion-icon>
          </div>}
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
