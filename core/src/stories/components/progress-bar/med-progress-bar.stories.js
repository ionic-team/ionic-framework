import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../med-colors';

export default {
  title: 'Components/Global/Progress Bar',
  decorators: [withDesign],
};

const Template = ({value = 0, percentage, color}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <ion-progress-bar .color=${color} value=${value / 100} ?percentage=${percentage}></ion-progress-bar>
        <!-- component -->

      </div>
    </ion-app>
    `
  }

export const ProgressBar = Template.bind();
ProgressBar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=313%3A107',
  },
}
ProgressBar.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  percentage: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Esconde ou mostra a porcentagem.'
  },
  value: {
    defaultValue: '0',
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: 'Define a porcentagem a ser mostrada.'
  },
};

