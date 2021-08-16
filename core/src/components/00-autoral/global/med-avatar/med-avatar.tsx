import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';
import { Color, Neutral } from '../../../../interface';

@Component({
  tag: 'med-avatar',
  styleUrl: 'med-avatar.scss',
  shadow: true,
})
export class MedAvatar {

  /**
   * Define a cor neutra do componente.
   */
   @Prop() color?: Color;

   /**
   * Define a cor neutra do componente.
   */
    @Prop() neutral?: Neutral;

  /**
   * Define a variação de tamanho do componente.
   */
  @Prop() dsSize?: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Define a imagem do componente.
   */
  @Prop() image?: string;

  /**
   * Define a imagem do componente.
   */
  @Prop() letter?: string;

  render() {

    const { color, neutral, dsSize, image, letter} = this;

    return (
      <Host from-stencil
      class={createColorClasses(color, {
        'med-avatar': true,
        [`med-avatar--${dsSize}`]: dsSize !== undefined,
      }, neutral)}
      >
        {(letter) && <span class="med-avatar__letter">{letter}</span>}
        {(image) && <img class="med-avatar__img" src={image}/>}
      </Host>
    );
  }

}
