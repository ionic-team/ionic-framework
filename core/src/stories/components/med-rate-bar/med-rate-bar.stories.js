import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Rate Bar',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-rate-bar>
          Avalie esse vídeo
          <med-rate-like slot="avaliacao"></med-rate-like>
        </med-rate-bar>
        <!-- component -->

      <div>
    </ion-app>
  `
}

export const RateBar = TemplateDefault.bind({});
RateBar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
  actions: {
    handles: ['medChange'],
  },
}
