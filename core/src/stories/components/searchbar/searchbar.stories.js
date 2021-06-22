import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Search Bar',
  decorators: [withDesign],
};

const TemplateDefault = ({}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <ion-searchbar show-clear-button="never" show-cancel-button="focus" cancel-button-text="Cancelar" mode="ios" search-icon="med-search"></ion-searchbar>
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
