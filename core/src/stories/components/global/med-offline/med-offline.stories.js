import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Offline',
  decorators: [withDesign],
};

const TemplateDefault = ({}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-offline ></med-offline>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Offline = TemplateDefault.bind({});
Offline.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4440%3A22017',
  },
}
