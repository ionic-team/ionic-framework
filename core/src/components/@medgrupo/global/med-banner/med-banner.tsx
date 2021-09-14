import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'med-banner',
  styleUrl: 'med-banner.scss',
  shadow: true,
})
export class MedBanner {
  /**
   * TODO
   */
  @Prop() header!: string;

  /**
   * TODO
   */
  @Prop() btnLeft!: string;

  /**
   * TODO
   */
  @Prop() btnRight!: string;

  /**
   * TODO
   */
  @Event() btnLeftClick!: EventEmitter<void>;

  /**
   * TODO
   */
  @Event() btnRightClick!: EventEmitter<void>;

  private onBtnLeftClick = () => {
    this.btnLeftClick.emit();
  }

  private onBtnRightClick = () => {
    this.btnRightClick.emit();
  }

  render() {
    const { header, btnLeft, btnRight } = this;

    return (
      <Host from-stencil>
        <div class="content">
          <div class="content__top">
            <div class="content__left">
              <slot name="imagem"></slot>
            </div>
            <div class="content__right">
              <h4 class="header">{header}</h4>
              <slot name="content"></slot>
            </div>
          </div>
          <div class="content__bottom">
            {btnLeft && <button class="button button--left" onClick={this.onBtnLeftClick}> {btnLeft} </button>}
            {btnRight && <button class="button button--right" onClick={this.onBtnRightClick}> {btnRight} </button>}
          </div>
        </div>
      </Host>
    );
  }
}
