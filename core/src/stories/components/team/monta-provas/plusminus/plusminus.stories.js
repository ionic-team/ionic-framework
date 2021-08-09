import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Plus Minus',
  decorators: [withDesign],
};

const TemplateDefault = () => {

  return html`
    <style>
    </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <monta-provas-plusminus ds-size="xl">500</monta-provas-plusminus>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const PlusMinus = TemplateDefault.bind({});
PlusMinus.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
  actions: {
    handles: ['medChange'],
  },
}
PlusMinus.argTypes = {

}
