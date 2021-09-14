import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Slides',
  decorators: [withDesign],
};

const TemplateDefault = ({color}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-slides pager="true">

          <ion-slide>
            <div class="slide">
              <p>The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a demonstration of proper code use.</p>
            </div>
          </ion-slide>

          <ion-slide>
            <p><b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.</p>
          </ion-slide>

          <ion-slide>
            <p><b>Appflow</b> is a powerful set of services and features built on top of Ionic Framework that brings a totally new level of app development agility to mobile dev teams.</p>
          </ion-slide>

          <ion-slide>
            <ion-button fill="clear">Continue <ion-icon class="med-icon" slot="end" name="arrow-forward"></ion-icon></ion-button>
          </ion-slide>

        </ion-slides>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Slides = TemplateDefault.bind({});
Slides.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8912',
  },
  actions: {
    handles: ['btnLeftClick', 'btnRightClick'],
  },
}
Slides.argTypes = {
  color: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  }
};
