import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Chart Radial/Default',
  decorators: [withDesign],
};

const Template = ({valores}) => {

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
          <med-chart-radial></med-chart-radial>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
Default.argTypes = {
  valores: {
    defaultValue: {
      valores: [
        {
          cor: 'med-color-fb-success',
          label: 'acertos',
          quantia: 32,
          ignoreBarra: false,
        },
        {
          cor: 'med-color-fb-caution',
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
      type:  { summary: 'MedRadialItem[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
