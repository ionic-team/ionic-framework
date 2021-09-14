import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Fab',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-fab vertical="center" horizontal="center" slot="fixed">
          <ion-fab-button .dsColor=${dsColor}>
            <ion-icon class="med-icon" name="add"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top">
            <ion-fab-button><ion-icon class="med-icon" name="logo-vimeo"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon class="med-icon" name="logo-twitter"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon class="med-icon" name="logo-facebook"></ion-icon></ion-fab-button>
            <ion-fab-button><ion-icon class="med-icon" name="logo-instagram"></ion-icon></ion-fab-button>
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
  }
}
FAB.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
};

