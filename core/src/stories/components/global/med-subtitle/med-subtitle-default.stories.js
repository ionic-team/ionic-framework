import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Subtitle',
  decorators: [withDesign],
};

const Template = ({dsColor}) => {
  return html`
    <style>
      med-subtitle {
        margin-bottom: 30px;
      }
    </style>

    <ion-app>
      <ion-content>

        <!-- component -->
        <med-subtitle .dsColor=${dsColor} ds-size="xxs">
          <h1>Subheading Base - Exemplo de Subtítulo</h1>
        </med-subtitle>

        <med-subtitle .dsColor=${dsColor} ds-size="sm">
        <h1>Subheading SM - Exemplo de Subtítulo</h1>
        </med-subtitle>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=6105%3A46607',
  },
}
Default.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
