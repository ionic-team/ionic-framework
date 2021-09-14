import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Divider',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor, text}) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
          <med-divider .dsColor=${dsColor} text="${text}"></med-divider>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Divider = TemplateDefault.bind({});
Divider.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4334%3A21616',
  },
}
Divider.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  text: {
    control: { type: 'text' },
    description: "Define o texto do componente.",
    defaultValue: 'Monta Provas',
  },
};
