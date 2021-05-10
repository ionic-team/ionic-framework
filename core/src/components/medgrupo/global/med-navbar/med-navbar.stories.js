import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Navbar',
  decorators: [withDesign],
};

const TemplateDefault = ({ platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-navbar>
        <ion-button ds-name="icon-label" slot="left">
          <ion-icon name="med-chevron-left"></ion-icon>
          voltar
        </ion-button>

        <span slot="title">header com título muito grande</span>
        <span slot="subtitle">subheader</span>

        <ion-button ds-name="icon-only" slot="right">
          <ion-icon slot="icon-only" name="med-star-filled"></ion-icon>
        </ion-button>
      </med-navbar>
      <!-- component -->

    </ion-app>
  `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
  actions: {
    handles: ['medResize'],
  },
}
Default.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};

const TemplateSecondary = ({ platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-navbar ds-name="secondary">
        <ion-button ds-name="icon-label" slot="left">
          <ion-icon name="med-chevron-left"></ion-icon>
          voltar
        </ion-button>

        <span slot="title">header com título muito grande</span>
        <span slot="subtitle">subheader</span>

        <ion-button ds-name="icon-only" slot="right">
          <ion-icon slot="icon-only" name="med-star-filled"></ion-icon>
        </ion-button>
      </med-navbar>
      <!-- component -->

    </ion-app>
  `
}

export const Secondary = TemplateSecondary.bind({});
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
Secondary.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};

const TemplateTransparent = ({ platform, theme }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-navbar ds-name="transparent" ds-theme=${theme}>
        <ion-button ds-name="icon-label" slot="left">
          <ion-icon name="med-chevron-left"></ion-icon>
          voltar
        </ion-button>

        <span slot="title">header com título muito grande</span>
        <span slot="subtitle">subheader</span>

        <ion-button ds-name="icon-only" slot="right">
          <ion-icon slot="icon-only" name="med-star-filled"></ion-icon>
        </ion-button>
      </med-navbar>
      <!-- component -->

    </ion-app>
  `
}

export const Transparent = TemplateTransparent.bind({});
Transparent.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
Transparent.argTypes = {
  theme: {
    defaultValue: 'dark',
    options: ['dark', 'light'],
    control: { type: 'radio' },
    description: 'Define a cor dos itens da navbar em contrate a determinado background.'
  },
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
