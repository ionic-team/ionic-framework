import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Chart Radial Label',
  decorators: [withDesign],
};

const Default = ({ valores }) => {

  setTimeout(() => {
    document.querySelector('med-chart-radial-label').valores = valores.valores;
  }, 1000);

  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <med-chart-radial-label></med-chart-radial-label>
          <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const ChartRadialLabel = Default.bind({});
ChartRadialLabel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
ChartRadialLabel.argTypes = {
  valores: {
    defaultValue: {
      valores: [
        {
          cor: 'med-color-fb-success',
          label: 'Acertos',
          quantia: 32,
          ignoreBarra: false,
        },
        {
          cor: 'med-color-fb-caution',
          label: 'Erros',
          quantia: 16,
          ignoreBarra: false,
        },
        {
          cor: '',
          label: 'Restantes',
          quantia: 52,
          ignoreBarra: true,
        }
      ],
    },
    control: { type: 'array' },
    description: 'Define a lista...',
    table: {
      type:  { summary: 'MedRadialItem[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
