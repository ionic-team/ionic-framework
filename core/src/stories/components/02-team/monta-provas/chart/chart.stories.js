import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Chart',
  decorators: [withDesign],
};

const TemplateDefault = ({valores}) => {

  setTimeout(() => {
    document.querySelector('med-chart-donut').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      .monta-provas__chart {
        background: var(--med-color-neutral-2);
        padding: var(--med-spacing-inset-base);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-width: 400px;
        margin: 0 auto;
      }

      .med-chart-donut__total {
        position: absolute;
        display: grid;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: var(--med-line-height-compressed);
      }

      .med-chart-donut__label {
        font-size: var(--med-font-size-nano);
        color: var(--med-color-neutral-dark-10);
      }

      .med-chart-donut__number {
        font-weight: var(--med-font-weight-bold);
        font-size: var(--med-font-size-md);
        color: var(--med-color-neutral-light-prime);
      }

      .monta-provas__info {
        display: grid;
        text-align: left;
      }
    </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <med-accordion icon="left">

          <div slot="header">Teste</div>

          <div class="monta-provas__chart" slot="content">

            <med-chart-donut class="med-chart-donut">
              <div class="med-chart-donut__total">
                <span class="med-chart-donut__label">Total de</span>
                <span class="med-chart-donut__number">100</span>
                <span class="med-chart-donut__label">Questões</span>
              </div>
            </med-chart-donut>

            <div class="monta-provas__info">
              <span>acertos 12</span>
              <span>erros 12</span>
              <span>nao realizadas 12</span>
            </div>

          </div>

        </med-accordion>

        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const ChartDonut = TemplateDefault.bind({});
ChartDonut.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
ChartDonut.argTypes = {
  valores: {
    defaultValue: {
      valores: [
        {
          cor: 'ion-color-success',
          label: 'acertos',
          quantia: 32,
          ignoreBarra: false,
        },
        {
          cor: 'ion-color-caution',
          label: 'erros',
          quantia: 16,
          ignoreBarra: false,
        },
        {
          cor: '',
          label: 'restantes',
          quantia: 52,
          ignoreBarra: true,
        }
      ],
    },
    control: { type: 'array' },
    description: 'Define a lista...',
    table: {
      type:  { summary: 'MedDonutItem[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
