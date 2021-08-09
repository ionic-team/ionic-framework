import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Input',
  decorators: [withDesign],
};

const TemplateDefault = ({ placeholder, stacked, helper }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-label ds-name="stacked">${stacked}</ion-label>
        <ion-input placeholder=${placeholder}></ion-input>
        <ion-label ds-name="helper">${helper}</ion-label>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Input = TemplateDefault.bind({});
Input.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}
Input.argTypes = {
  placeholder: {
    control: { type: 'text' },
    defaultValue: 'Enter Input',
    description: "Atributo do componente ionic.",
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  stacked: {
    control: { type: 'text' },
    defaultValue: 'Stacked',
    description: "Digite algo!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
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
