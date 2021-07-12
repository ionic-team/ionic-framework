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
        background: var(--med-colors-neutral-2);
        padding:
      }
    </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <div class="monta-provas__chart">
            <med-chart-donut class="med-chart-donut">
              <div class="med-chart-donut__total">
                <span class="med-chart-donut__label">Total de</span>
                <span class="med-chart-donut__number">100</span>
                <span class="med-chart-donut__label">Questões</span>
              </div>
            </med-chart-donut>
          </div>
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
          label: 'acertos',
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
