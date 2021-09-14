import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Progress Bar',
  decorators: [withDesign],
};

const Template = ({dsColor, dsName, value = 0, percentage}) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
          <ion-progress-bar .dsColor=${dsColor} ds-name=${dsName} value=${value / 100} ?percentage=${percentage}></ion-progress-bar>
        <!-- component -->

        </div>
      </ion-content>
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
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsName: {
    options: [undefined, 'minimalist', 'skin'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    defaultValue: "undefined",
    table: {
      type:  { summary: 'minimalist | skin' },
      defaultValue: { summary: 'minimalist' },
    },
  },
  percentage: {
    control: { type: 'boolean'},
    description: "Esconde ou mostra a porcentagem.",
    defaultValue: true,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  value: {
    defaultValue: '50',
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: 'Define a porcentagem a ser mostrada.'
  },

};

