import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Pages/Minhas Provas',
  decorators: [withDesign],
};

const TemplateDefault = ({valores}) => {

  setTimeout(() => {
    document.querySelector('med-chart-donut').valores = valores.valores;
    document.querySelector('med-chart-label').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      .monta-provas-accordion__header {
        font-size: var(--med-font-size-xs);
        font-weight: var(--med-font-weight-semibold);
        line-height: var(--med-line-height-default);
        color: var(--med-color-neutral-10);
        margin: 0;
        padding; 0;
        width: 100%;
      }

      .monta-provas-chart {
        background: var(--med-color-neutral-2);
        padding: var(--med-spacing-stretch-md);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-width: 400px;
        margin: 0 auto;
      }

      .monta-provas-chart__total {
        position: absolute;
        display: grid;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: var(--med-line-height-compressed);
      }

      .monta-provas-chart__label {
        font-size: var(--med-font-size-nano);
        color: var(--med-color-neutral-dark-10);
        font-weight: var(--med-font-weight-bold);
      }

      .monta-provas-chart__number {
        font-weight: var(--med-font-weight-bold);
        font-size: var(--med-font-size-md);
        color: var(--med-color-neutral-light-prime);
      }
    </style>

    <ion-app class="storybook-only">
      <med-header>
        <med-navbar slot="navbar">
          <ion-button ds-name="icon-only">
            <ion-icon slot="icon-only" name="med-chevron-left"></ion-icon>
          </ion-button>

          <span slot="title">Monta Provas</span>
        </med-navbar>
      </med-header>

      <ion-content>
        <med-accordion class="monta-provas-accordion" icon="left">
          <h4 class="monta-provas-accordion__header" slot="header">Nome da Prova</h4>

          <div class="monta-provas-chart" slot="content">

            <med-chart-donut class="monta-provas-chart__donut">
              <div class="monta-provas-chart__total">
                <span class="monta-provas-chart__label">Total de</span>
                <span class="monta-provas-chart__number">100</span>
                <span class="monta-provas-chart__label">Questões</span>
              </div>
            </med-chart-donut>

            <med-chart-label class="monta-provas-chart__label"></med-chart-label>

          </div>
        </med-accordion>
      </ion-content>
    </ion-app>
  `
}

export const MinhasProvas = TemplateDefault.bind({});
MinhasProvas.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
