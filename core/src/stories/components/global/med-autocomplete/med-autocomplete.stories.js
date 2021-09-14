import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Auto Complete',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content>
        <div>

          <!-- component -->
          <med-autocomplete></med-autocomplete>
          <!-- component -->

        </div>
      </ion-content>
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
