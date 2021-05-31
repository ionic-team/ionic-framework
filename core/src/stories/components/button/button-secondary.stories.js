import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateSecondary = ({ disabled, size, label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="secondary" ?disabled=${disabled} ds-size=${size}>${label}</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonSecondary = TemplateSecondary.bind({});
ButtonSecondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}
ButtonSecondary.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  size: {
    options: [undefined, 'xxs', 'xs', 'sm'],
    control: { type: 'radio'},
    description: "Define o tamanho do botão.",
    table: {
      type:  { summary: 'xxs | xs | sm' },
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
