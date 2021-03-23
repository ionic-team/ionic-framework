import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/ion-button/icon-only',
  decorators: [withDesign],
};

const Template = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button icon-only>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8L11 16L19 24" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1219%3A242',
  },
}

const TemplateDisabled = () => {
  return html`
    <ion-app>
      <ion-content>
        <ion-button icon-only disabled>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8L11 16L19 24" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </ion-button>
      </ion-content>
    </ion-app>
    `
  }

export const Disabled = TemplateDisabled.bind({});
Disabled.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1219%3A242',
  },
}
