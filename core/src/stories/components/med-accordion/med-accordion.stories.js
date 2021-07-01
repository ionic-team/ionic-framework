import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../med-colors'

export default {
  title: 'Components/Global/Accordion',
  decorators: [withDesign],
};

const TemplateDefault = ({color}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-accordion .color=${color}>
            <ion-icon slot="image" name="med-star-filled"></ion-icon>
            <p slot="title">texto</p>
            <p slot="content">texto2</p>
          </med-accordion>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Accordion = TemplateDefault.bind({});
Accordion.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
  actions: {
    handles: ['btnLeftClick', 'btnRightClick'],
  },
}
Accordion.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  }
};

const TemplateAccordionFull = ({color}) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-accordion ds-size="full" .color=${color}>
            <ion-icon slot="image" name="med-star-filled"></ion-icon>
            <p slot="title">texto</p>
            <p slot="content">texto2</p>
          </med-accordion>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const AccordionFull = TemplateAccordionFull.bind({});
AccordionFull.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
  actions: {
    handles: ['btnLeftClick', 'btnRightClick'],
  },
}
Accordion.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  }
};
