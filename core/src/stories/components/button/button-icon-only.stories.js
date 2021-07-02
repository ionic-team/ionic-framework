import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../med-colors';
import { medIcons } from '../../med-icons';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconOnly = ({ color, disabled, size, platform, iconName }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
    document.querySelector('html').classList.remove('plt-electron');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
    document.querySelector('html').classList.add('plt-electron');
  }

  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="icon-only" .color=${color} ?disabled=${disabled} ds-size=${size}>
          <ion-icon slot="icon-only" name=${iconName}></ion-icon>
        </ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ButtonIconOnly = TemplateIconOnly.bind({});
ButtonIconOnly.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1615%3A3',
  },
}
ButtonIconOnly.argTypes = {
  color: {
    options: medsoftColors,
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
    defaultValue: 'none',
    options: [undefined, 'xs', 'sm', 'md', 'lg'],
    control: { type: 'radio'},
    description: "Define os tamanhos dos botões.",
    table: {
      type:  { summary: ['xs | sm | md | lg'] },
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
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['desktop | mobile'] },
      defaultValue: { summary: 'desktop' },
    },
  },
};
