import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Auto Complete',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-autocomplete></med-autocomplete>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const AutoComplete = TemplateDefault.bind({});
AutoComplete.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
};
