import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Navbar',
  decorators: [withDesign],
};

const TemplateTransparent = ({ platform, dsTheme }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-navbar ds-name="transparent" ds-theme=${dsTheme}>
        <ion-button ds-name="icon-label" slot="left">
          <ion-icon name="med-chevron-left"></ion-icon>
          voltar
        </ion-button>

        <span slot="title">header</span>
        <span slot="subtitle">subheader</span>

        <ion-button ds-name="icon-only" slot="right">
          <ion-icon slot="icon-only" name="med-star-filled"></ion-icon>
        </ion-button>
      </med-navbar>
      <!-- component -->

    </ion-app>
  `
}

export const NavbarTransparent = TemplateTransparent.bind({});
NavbarTransparent.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
NavbarTransparent.argTypes = {
  dsTheme: {
    defaultValue: 'dark',
    options: ['dark', 'light'],
    control: { type: 'radio' },
    description: 'Define a cor dos itens da navbar em contrate a determinado background.',
    table: {
      type:  { summary: 'dark | light' },
      defaultValue: { summary: 'undefined' },
    },
  },
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
