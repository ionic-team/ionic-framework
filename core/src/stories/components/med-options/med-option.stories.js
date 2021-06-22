import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Option',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content>

        <ion-radio-group value="value">

          <!-- component -->
          <med-option>
            <ion-radio></ion-radio>
            <label slot="label" value="A">A</label>
          </med-option>
          <!-- component -->

        </ion-radio-group>

      <ion-content>
    </ion-app>
    `
}

export const Option = TemplateDefault.bind({});
Option.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
