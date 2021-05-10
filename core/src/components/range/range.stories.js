import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Popover',
  decorators: [withDesign],
};

const TemplateDefault = () => {

  return html`
    <ion-app>
      <ion-content>

        <!-- component -->



        <!-- component -->

      </ion-content>
    </ion-app>
    `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
