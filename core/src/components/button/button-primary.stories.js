import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button/Primary',
  decorators: [withDesign],
};

const TemplatePrimary = ({ disabled, expand }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <ion-button ds-name="primary" ?disabled=${disabled} .expand=${expand}>ion-button</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Primary = TemplatePrimary.bind({});
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}
Primary.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.'
  },
  expand: {
    defaultValue: 'none',
    options: ['none', 'full', 'block'],
    control: { type: 'radio'},
    description: "Define o comportamento 'full' ou 'block' do botão."
  },
};
