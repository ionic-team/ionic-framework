import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Search Bar',
  decorators: [withDesign],
};

const TemplateDefault = ({color, neutral}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <ion-searchbar .color=${color} .neutral=${neutral} show-clear-button="never" show-cancel-button="focus" cancel-button-text="Cancelar" mode="ios" search-icon="med-search"></ion-searchbar>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const SearchBar = TemplateDefault.bind({});
SearchBar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2200%3A0',
  },
};
SearchBar.argTypes = {
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
};
