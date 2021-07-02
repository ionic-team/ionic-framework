import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../../med-colors';
import { medIcons } from '../../../med-icons';

export default {
  title: 'Components/Global/Button/States',
  decorators: [withDesign],
};

const TemplateFocused = ({ color, size, slot, iconName }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <ion-button class="ion-focused" ds-name="primary" .color=${color} ds-size=${size}>${slot}</ion-button>
          <ion-button class="ion-focused" ds-name="secondary" .color=${color} ds-size=${size}>${slot}</ion-button>
          <ion-button class="ion-focused" ds-name="tertiary" .color=${color} ds-size=${size}>${slot}</ion-button>
          <ion-button class="ion-focused" ds-name="icon-only" .color=${color} ds-size=${size}>
            <ion-icon slot="icon-only" name=${iconName}></ion-icon>
          </ion-button>
          <ion-button class="ion-focused" ds-name="icon-label" .color=${color} ds-size=${size}>
            <ion-icon name=${iconName} slot="start"></ion-icon>
            ${slot}
          </ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonFocused = TemplateFocused.bind({});
ButtonFocused.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}
ButtonFocused.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
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
  iconName: {
    options: medIcons,
    control: { type: 'select'},
    defaultValue: 'med-arrow-left-circle',
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-arrow-left-circle' },
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
