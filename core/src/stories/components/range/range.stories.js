import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Range',
  decorators: [withDesign],
};

const TemplateDefault = () => {

  return html`
    <ion-app>
      <ion-content>

        <!-- component -->

          <ion-range max="5">
            <ion-icon slot="start" size="small" name="med-font-decrease"></ion-icon>
            <ion-icon slot="end" name="med-font-increase"></ion-icon>
           </ion-range>

        <!-- component -->

      </ion-content>
    </ion-app>
    `
}

export const Range = TemplateDefault.bind({});
Range.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
