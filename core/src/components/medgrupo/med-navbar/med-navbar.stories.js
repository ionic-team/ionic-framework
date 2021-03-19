import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import imageFile from '../../../../';

export default {
  title: 'Components/med-navbar',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
  <ion-app>
    <med-navbar></med-navbar>
    <ion-content></ion-content>
  </ion-app>
    `
  }

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateIconLeft = () => {
  return html`
  <ion-app>
    <med-navbar>
      <img slot="left" src='../.storybook/assets/left-icon.svg'>
      <img slot="right" src='../../../../.storybook/assets/right-icon.svg'>
    </med-navbar>
    <ion-content></ion-content>
  </ion-app>
    `
  }

export const IconLeft = TemplateIconLeft.bind({});
IconLeft.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}