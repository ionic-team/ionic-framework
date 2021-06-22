import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Input',
  decorators: [withDesign],
};

const TemplateSuccess = ({ placeholder }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-input placeholder="${placeholder}" success>
          <ion-icon name="med-check-circle"></ion-icon>
        </ion-input>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const InputSuccess = TemplateSuccess.bind({});
InputSuccess.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}
InputSuccess.argTypes = {
  placeholder: {
    control: { type: 'text' },
    defaultValue: 'Enter Input',
    description: "Atributo do componente ionic.",
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
