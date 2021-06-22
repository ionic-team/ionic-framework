import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors } from '../../med-colors';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateSecondary = ({ color, disabled, size, slot }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button .color=${color} ds-name="secondary" ?disabled=${disabled} ds-size=${size}>${slot}</ion-button>
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
