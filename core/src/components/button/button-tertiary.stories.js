import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button/Tertiary',
  decorators: [withDesign],
};

const TemplateTertiary = ({ disabled, expand }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="tertiary" ?disabled=${disabled} .expand=${expand}>ion-button</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Tertiary = TemplateTertiary.bind({});
Tertiary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}
Tertiary.argTypes = {
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
