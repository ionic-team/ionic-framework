import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button/Secondary',
  decorators: [withDesign],
};

const TemplateSecondary = ({ disabled }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="secondary" ?disabled=${disabled}>ion-button</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Secondary = TemplateSecondary.bind({});
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=759%3A0',
  },
}
Secondary.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.'
  }
};
