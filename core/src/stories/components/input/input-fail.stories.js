import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Input',
  decorators: [withDesign],
};

const TemplateFail = ({ label, helper }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-input placeholder=${label} fail></ion-input>
        <ion-label ds-name="helper" fail>${helper}</ion-label>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const InputFail = TemplateFail.bind({});
InputFail.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}
InputFail.argTypes = {
  label: {
    control: { type: 'text' },
    defaultValue: 'Enter Input',
    description: "Digite algo!",
    table: {
      type: { summary: 'Atributo para testes no storybook apenas' },
    },
  },
  helper: {
    control: { type: 'text' },
    defaultValue: 'Helper',
    description: "Digite algo!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
    },
  },
}
