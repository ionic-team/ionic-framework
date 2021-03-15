import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/ion-button/secondary',
  decorators: [withDesign],
};

const Template = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button secondary>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}

const TemplateDisabled = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button secondary disabled>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Disabled = TemplateDisabled.bind({});
Disabled.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}

const TemplateBlock = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button secondary block>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Block = TemplateBlock.bind({});
Block.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}

const TemplateFull = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button secondary full>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Full = TemplateFull.bind({});
Full.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}
