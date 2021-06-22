import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medIcons } from '../../med-icons';
import { medColors } from '../../med-colors';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconlabel = ({ disabled, iconName, slot }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <h2>Slot start</h2>
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          ${slot}
          <ion-icon name=${iconName} slot="start"></ion-icon>
        </ion-button>
        <!-- component -->

        <div style="width: 100%;"></div>

        <!-- component -->
        <h2>Slot end</h2>
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          <ion-icon name=${iconName} slot="end"></ion-icon>
          ${slot}
        </ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonIconLabel = TemplateIconlabel.bind({});
ButtonIconLabel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1619%3A594',
  },
}
ButtonIconLabel.argTypes = {
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
