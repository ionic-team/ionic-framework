import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-vote',
  styleUrl: 'med-vote.scss',
  shadow: true,
})
export class MedVote {

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() titulo? = 'Cabe recurso?';

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() like: number = 0;

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() unlike: number = 0;

  render() {
    const titulo =  this.titulo
    const like = isNaN(this.like) ? 0 : +this.like;
    const unlike = isNaN(this.unlike) ? 0 : +this.unlike;
    const total = like + unlike
    const likePercent = ((like*100)/total)
    const unlikePercent = ((unlike*100)/total)

    return (
      <Host
        from-stencil
        class={createColorClasses(null, {
          'med-vote': true,
        }, null)}>
        <div class="med-vote__row">
          <div class="med-vote__icon-container">
            <ion-icon class="med-icon med-vote__icon med-vote__icon--cabe" name="med-positivo"></ion-icon>
            <div class="med-vote__badge med-vote__badge--cabe">{like}</div>
          </div>
          <h3 class="med-vote__heading" innerHTML={titulo}></h3>
          <div class="med-vote__icon-container">
            <div class="med-vote__badge med-vote__badge--nao-cabe">{unlike}</div>
            <ion-icon class="med-icon med-vote__icon med-vote__icon--nao-cabe" name="med-negativo"></ion-icon>
          </div>
        </div>
        <div class="med-vote__row">
          <div class="med-vote__chart med-vote__chart--cabe" style={{ width: `${likePercent}%` }}></div>
          <div class="med-vote__chart med-vote__chart--nao-cabe" style={{ width: `${unlikePercent}%` }}></div>
        </div>
      </Host>
    );
  }

}
