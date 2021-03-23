import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/ion-button/default',
  decorators: [withDesign],
};

const Template = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button>ion button</ion-button>
      </ion-content>
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

const TemplateDisabled = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button disabled>ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const Disabled = TemplateDisabled.bind({});
Disabled.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateBlock = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button block>ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const Block = TemplateBlock.bind({});
Block.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateFull = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button full>ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const Full = TemplateFull.bind({});
Full.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateSizeSM = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button size="sm">ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const SizeSM = TemplateSizeSM.bind({});
SizeSM.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateSizeXS = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button size="xs">ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const SizeXS = TemplateSizeXS.bind({});
SizeXS.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}

const TemplateSizeXXS = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button size="xxs">ion button</ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const SizeXXS = TemplateSizeXXS.bind({});
SizeXXS.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}