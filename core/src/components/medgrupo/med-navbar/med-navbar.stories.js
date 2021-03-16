import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/med-navbar',
  decorators: [withDesign],
};

const Template = () => {
  return html`
  <ion-app>
    <med-navbar></med-navbar>
    <ion-content></ion-content>
  </ion-app>
    `
  }

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const Template = () => {
  return html`
  <ion-app>
    <med-navbar></med-navbar>
    <ion-content></ion-content>
  </ion-app>
    `
  }

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}