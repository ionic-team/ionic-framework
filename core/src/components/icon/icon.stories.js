import { html } from 'lit-html';

export default {
  title: 'Components/Global/Icon',
  decorators: [],
};

const TemplateIconOnly = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container storybook-only__container--icons">

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-arrow-left-circle"></ion-icon>
          </ion-button>
           - med-arrow-left-circle
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-arrow-right-circle"></ion-icon>
          </ion-button>
          - med-arrow-right-circle
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-cartao-resposta"></ion-icon>
          </ion-button>
          - med-cartao-resposta
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-chevron-left"></ion-icon>
          </ion-button>
          - med-chevron-left
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-comentario-questao"></ion-icon>
          </ion-button>
          - med-comentario-questao
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-discursiva"></ion-icon>
          </ion-button>
          - med-discursiva
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-dislike"></ion-icon>
          </ion-button>
          - med-dislike
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-eye-hide-line"></ion-icon>
          </ion-button>
          - med-eye-hide-line
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-eye-show-line"></ion-icon>
          </ion-button>
          - med-eye-show-line
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-font-size"></ion-icon>
          </ion-button>
          - med-font-size
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-impresso"></ion-icon>
          </ion-button>
          - med-impresso
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-like"></ion-icon>
          </ion-button>
          - med-like
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-notes"></ion-icon>
          </ion-button>
          - med-notes
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-questao"></ion-icon>
          </ion-button>
          - med-questao
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-star-filled"></ion-icon>
          </ion-button>
          - med-star-filled
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-star-outline"></ion-icon>
          </ion-button>
          - med-star-outline
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-font-decrease-32"></ion-icon>
          </ion-button>
          - med-font-decrease-32
        </div>

        <div class="storybook-only__icon-container">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-font-increase-32"></ion-icon>
          </ion-button>
          - med-font-increase-32
        </div>

      </div>
    </ion-app>
  `
}

export const IconOnly = TemplateIconOnly.bind({});
