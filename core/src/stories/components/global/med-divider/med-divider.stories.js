import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors,medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Divider',
  decorators: [withDesign],
};

const TemplateDefault = ({color, neutral, text}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-divider .color=${color} .neutral=${neutral} text="${text}"></med-divider>
        <!-- component -->

      <div>
    </ion-app>
  `
}

export const Divider = TemplateDefault.bind({});
Divider.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4334%3A21616',
  },
}
Divider.argTypes = {
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'select'},
    description: "Define a cor neutral do componente.",
    table: {
      type:  { summary: 'Neutrals' },
      defaultValue: { summary: 'undefined' },
    },
  },
  text: {
    control: { type: 'text' },
    description: "Define o texto do componente.",
    defaultValue: 'Monta Provas',
  },
};
