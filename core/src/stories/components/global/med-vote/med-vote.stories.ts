import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Vote',
  decorators: [withDesign],
};

const Template = ({ titulo, cabe, naoCabe }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-vote .titulo=${titulo} .cabe=${cabe} .nao-cabe=${naoCabe}></med-vote>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Vote = Template.bind({});
Vote.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5404%3A38994',
  },
}
Vote.argTypes = {
  color: {
    options: medColors,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'inline-radio'},
    description: "Define a cor neutra do componente.",
    table: {
      type:  { summary: 'Neutrals' },
      defaultValue: { summary: 'undefined' },
    },
  },
  titulo: {
    control: { type: 'text' },
    description: "Define o titulo do componente.",
    defaultValue: 'Cabe recurso?',
  },
  cabe: {
    control: { type: 'text' },
    description: "Define a quantidade de recursos que cabem.",
    defaultValue: '155',
  },
  naoCabe: {
    control: { type: 'text' },
    description: "Define a quantidade de recursos que cabem.",
    defaultValue: '155',
  },
};
