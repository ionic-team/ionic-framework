import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Fab',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-fab vertical="center" horizontal="center" slot="fixed">
          <ion-fab-button>
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top">
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-instagram"></ion-icon></ion-fab-button>
          </ion-fab-list>
        </ion-fab>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const FAB = TemplateDefault.bind({});
FAB.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2436%3A21',
  },
};

