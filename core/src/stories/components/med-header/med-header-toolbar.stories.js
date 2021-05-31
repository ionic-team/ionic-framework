import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Header',
  decorators: [withDesign],
};

const TemplateToolbar = ({ platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

    <!-- component -->
    <med-header>

      <med-navbar slot="navbar">
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

      <med-toolbar slot="toolbar">
        <ion-button ds-name="icon-only" slot="start">
          <ion-icon slot="icon-only" name="med-arrow-left-circle"></ion-icon>
        </ion-button>
        <ul>
          <li>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-star-outline"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-eye-show-line"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-notes"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-font-size"></ion-icon>
            </ion-button>
          </li>
        </ul>
        <ion-button ds-name="icon-only" slot="end">
          <ion-icon slot="icon-only" name="med-arrow-right-circle"></ion-icon>
        </ion-button>
      </med-toolbar>

    </med-header>
    <!-- component -->

  </ion-app>
  `
}

export const Toolbar = TemplateToolbar.bind({});
Toolbar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
  actions: {
    handles: ['medResize'],
  },
}
Toolbar.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
