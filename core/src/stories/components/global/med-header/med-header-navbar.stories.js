import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Header',
  decorators: [withDesign],
};

const TemplateNavbar = ({ platform }) => {
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
            <ion-icon class="med-icon" name="med-chevron-left"></ion-icon>
            voltar
          </ion-button>

          <span slot="title">header com título muito grande</span>
          <span slot="subtitle">subheader</span>

          <ion-button ds-name="icon-only" slot="right">
            <ion-icon class="med-icon" slot="icon-only" name="med-star-filled"></ion-icon>
          </ion-button>
        </med-navbar>

      </med-header>
      <!-- component -->

    </ion-app>
  `
}

export const Navbar = TemplateNavbar.bind({});
Navbar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
  actions: {
    handles: ['medResize'],
  },
}
Navbar.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
