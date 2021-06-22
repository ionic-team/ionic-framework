import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors } from '../../med-colors';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateTertiary = ({ color, disabled, expand, size, slot }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="tertiary" .color=${color} ?disabled=${disabled} .expand=${expand} ds-size=${size}>${slot}</ion-button>
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
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
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
  slot: {
    control: { type: 'text' },
    defaultValue: 'button',
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'button' },
    },
  },
};
