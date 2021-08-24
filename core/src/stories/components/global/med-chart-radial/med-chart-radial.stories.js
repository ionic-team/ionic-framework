import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors } from '../../../med-colors';

export default {
  title: 'Components/Core/Chart Radial',
  decorators: [withDesign],
};

const Default = ({valores, dsName, color}) => {

  setTimeout(() => {
    document.querySelector('med-chart-radial').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      med-chart-radial {
        justify-content: center;
      }
    </style>
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-chart-radial .color=${color} ds-name=${dsName}></med-chart-radial>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ChartRadial = Default.bind({});
ChartRadial.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
ChartRadial.argTypes = {
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
  color: {
    options: medColors,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsName: {
    options: [undefined, 'simple'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    defaultValue: "simple",
    table: {
      type:  { summary: 'simple' },
      defaultValue: { summary: 'undefined' },
    },
  },
  // valores: {
  //   defaultValue: {
  //     valores: [
  //       {
  //         cor: 'ion-color-fb-success',
  //         label: 'acertos',
  //         quantia: 32,
  //         ignoreBarra: false,
  //       },
  //       {
  //         cor: 'ion-color-fb-caution',
  //         label: 'acertos',
  //         quantia: 16,
  //         ignoreBarra: false,
  //       },
  //       {
  //         cor: '',
  //         label: 'restantes',
  //         quantia: 52,
  //         ignoreBarra: true,
  //       }
  //     ],
  //   },
  //   control: { type: 'array' },
  //   description: 'Define a lista...',
  //   table: {
  //     type:  { summary: 'MedRadialItem[]' },
  //     defaultValue: { summary: 'undefined' },
  //   },
  // },
}
