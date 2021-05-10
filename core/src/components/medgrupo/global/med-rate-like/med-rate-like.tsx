import { Component, Host, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'med-rate-like',
  styleUrl: 'med-rate-like.scss',
  shadow: true,
})
export class MedAvalicao {
  @State() clicked!: 'like' | 'dislike';
  @Event() medChange!: EventEmitter<'like' | 'dislike'>;

  private onClick = (button: string) => {

    if (button === 'like' && this.clicked !== 'like') {
      this.clicked = 'like';
    }

    if (button === 'dislike' && this.clicked !== 'dislike') {
      this.clicked = 'dislike';
    }

    this.medChange.emit((this.clicked === 'like') ? 'like' : 'dislike');

    console.log(this.clicked);
  }

  render() {
    return (
      <Host from-stencil>
        <button class={`button ${this.clicked === 'like' ? 'button_like' : ''}`} onClick={() => this.onClick('like')}>
          <ion-icon name="med-like" class="rate"></ion-icon>
        </button>
        <button class={`button ${this.clicked === 'dislike' ? 'button_dislike' : ''}`} onClick={() => this.onClick('dislike')}>
          <ion-icon name="med-dislike" class="rate"></ion-icon>
        </button>
      </Host>
    );
  }

}
