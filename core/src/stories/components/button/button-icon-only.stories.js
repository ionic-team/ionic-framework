import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconOnly = ({ disabled, size, platform, iconName }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="icon-only" ?disabled=${disabled} ds-size=${size}>
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
    description: "Mude o ícone!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
    },
  },
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['desktop | mobile'] },
      defaultValue: { summary: 'desktop' },
    },
  },
};
