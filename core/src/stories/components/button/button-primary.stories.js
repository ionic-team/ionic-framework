import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplatePrimary = ({ disabled, expand, label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <ion-button ds-name="primary" ?disabled=${disabled} .expand=${expand}>${label}</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonPrimary = TemplatePrimary.bind({});
ButtonPrimary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}
ButtonPrimary.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  expand: {
    defaultValue: 'none',
    options: [undefined, 'full', 'block'],
    control: { type: 'radio'},
    description: "Define o comportamento 'full' ou 'block' do botão.",
    table: {
      type:  { summary: ['full | block'] },
      defaultValue: { summary: 'undefined' },
    },
  },
  label: {
    control: { type: 'text' },
    defaultValue: 'button',
    description: "Digite algo!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
    },
  },
};
