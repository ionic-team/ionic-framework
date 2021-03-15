import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/ion-button/tertiary',
  decorators: [withDesign],
};

const Template = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button tertiary>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}

const TemplateDisabled = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button tertiary disabled>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Disabled = TemplateDisabled.bind({});
Disabled.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}

const TemplateBlock = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button tertiary block>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Block = TemplateBlock.bind({});
Block.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}

const TemplateFull = () => {
  return html`
  <ion-app>
    <ion-content>
      <ion-button tertiary full>ion button</ion-button>
    </ion-content>
  </ion-app>
    `
  }

export const Full = TemplateFull.bind({});
Full.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=764%3A19',
  },
}
