import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Range',
  decorators: [withDesign],
};

const TemplateDefault = ({}) => {
  return html`
  <ion-app class="storybook-only">
    <div class="storybook-only__container">

        <!-- component -->
          <ion-range max="5">
            <ion-icon class="med-icon" slot="start" size="small" name="med-fontemenor"></ion-icon>
            <ion-icon class="med-icon" slot="end" name="med-fontemaior"></ion-icon>
          </ion-range>
        <!-- component -->

      </div>
    </ion-app>
    `
}

export const Range = TemplateDefault.bind({});
Range.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2200%3A0',
  },
};
