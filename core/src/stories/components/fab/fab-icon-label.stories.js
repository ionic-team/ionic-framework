import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Fab',
  decorators: [withDesign],
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

export const FABIconLabel = TemplateIconLabel.bind({});
FABIconLabel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2436%3A21',
  },
};
