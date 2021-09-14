import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Chart Radial/Secondary',
  decorators: [withDesign],
};

const Default = ({dsColor, valores}) => {

  setTimeout(() => {
    document.querySelector('med-chart-radial').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      med-chart-radial {
        justify-content: center;
      }
    </style>
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
          <med-chart-radial .dsColor=${dsColor} ds-name="secondary"></med-chart-radial>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Secondary = Default.bind({});
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
Secondary.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  valores: {
    defaultValue: {
      valores: [
        {
          cor: '',
          label: 'acertos',
          quantia: 32,
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
      type:  { summary: 'MedRadialItem[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
