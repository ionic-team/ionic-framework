import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Accordion',
  decorators: [withDesign],
};

const TemplateDefault = ({size}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-accordion .size=${size}>
          <div slot="header">
            test
          </div>
          <div slot="content">
          <p>teste</p>
          <p>teste</p>
          <p>teste</p>
          <p>teste</p>
          <p>teste</p>
          <p>teste</p>
          <p>teste</p>
          </div>
          </med-accordion>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Accordion = TemplateDefault.bind({});
Accordion.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
}
Accordion.argTypes = {
  size: {
    options: [undefined, 'full'],
    control: { type: 'radio'},
    description: "Aplica tamanho fullscreen.",
    table: {
      type:  { summary: 'full' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
