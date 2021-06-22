import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import imageTest from "./image-test.png";

export default {
  title: 'Components/Global/Banner',
  decorators: [withDesign],
};

const TemplateDefault = ({ header, btnLeft, btnRight }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-banner header=${header} btn-left=${btnLeft} btn-right=${btnRight}>
            <img slot="imagem" src=${imageTest} alt="">
            <p slot="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam eaque deserunt quidem! Doloribus voluptatem quod porro facere voluptate et. Minima explicabo placeat doloribus voluptatibus magni iusto consequatur perferendis libero, porro cum. Unde, corrupti alias, vitae aliquid iure asperiores ratione optio vel culpa tempora temporibus, molestias labore? Iusto repudiandae voluptatibus ab.</p>
          </med-banner>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Banner = TemplateDefault.bind({});
Banner.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
  actions: {
    handles: ['btnLeftClick', 'btnRightClick'],
  },
}
Banner.argTypes = {
  header: {
    control: { type: 'text' },
    defaultValue: 'Notification Title',
    description: "Define o título do banner.",
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  btnLeft: {
    control: { type: 'text' },
    defaultValue: 'cancelar',
    description: "Define o texto do botão esquerdo, se existir.",
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  btnRight: {
    control: { type: 'text' },
    defaultValue: 'cancelar',
    description: "Define o texto do botão esquerdo, se existir.",
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
