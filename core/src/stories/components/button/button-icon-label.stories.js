import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medIcons } from '../../med-icons';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconlabel = ({ disabled, iconName, label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          ${label}
          <ion-icon name=${iconName} slot="start"></ion-icon>
        </ion-button>
        <!-- component -->

        <div style="width: 100%;"></div>

        <!-- component -->
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          <ion-icon name=${iconName} slot="end"></ion-icon>
          ${label}
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
    description: "Mude o ícone!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
    },
  },
  label: {
    control: { type: 'text' },
    defaultValue: 'button',
    description: "Digite algo!",
    table: {
      type: { summary: 'Atributo para testes no storybook apenas' },
    },
  },
};
