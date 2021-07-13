import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors } from '../../../med-colors';

export default {
  title: 'Components/Core/Agrupador',
  decorators: [withDesign],
};

const TemplateDefault = ({color}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-agrupador .color=${color}></med-agrupador>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Agrupador = TemplateDefault.bind({});
Agrupador.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2781%3A8634',
  },
}
Agrupador.argTypes = {
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  }
};
