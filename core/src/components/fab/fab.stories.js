import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Fab',
  decorators: [withDesign],
};

//
// Default
//

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

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2436%3A21',
  },
};

//
// Icon + label
//

const TemplateIconLabel = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-fab vertical="center" horizontal="center" slot="fixed">
          <ion-fab-button ds-size="lg" ds-name="icon-label">
            <ion-icon name="add"></ion-icon>
            <ion-label slot="label">Label</ion-label>
          </ion-fab-button>
        </ion-fab>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const IconLabel = TemplateIconLabel.bind({});
IconLabel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2436%3A21',
  },
};

//
// label Only
//

const TemplateLabel = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-fab vertical="center" horizontal="center" slot="fixed">
          <ion-fab-button ds-size="md" ds-name="label">
            <ion-label slot="label">Label</ion-label>
          </ion-fab-button>
          <ion-fab-list side="start">
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
          </ion-fab-list>
          <ion-fab-list side="end">
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
          </ion-fab-list>
        </ion-fab>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const LabelOnly = TemplateLabel.bind({});
LabelOnly.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2436%3A21',
  },
};
