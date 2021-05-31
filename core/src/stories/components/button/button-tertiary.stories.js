import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateTertiary = ({ disabled, expand, size, label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="tertiary" ?disabled=${disabled} .expand=${expand} ds-size=${size}>${label}</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonTertiary = TemplateTertiary.bind({});
ButtonTertiary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}
ButtonTertiary.argTypes = {
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
