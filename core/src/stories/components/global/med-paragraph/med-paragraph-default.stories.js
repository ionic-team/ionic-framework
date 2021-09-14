import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Paragraph',
  decorators: [withDesign],
};

const Template = ({dsColor}) => {
  return html`
    <style>
      med-paragraph {
        margin-bottom: 30px;
      }
    </style>

    <ion-app>
      <ion-content>

        <!-- component -->
        <med-paragraph .dsColor=${dsColor} ds-size="xxs">
          <h1>paragraph XXS <br/>Exemplo de Título</h1>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="xxs" ds-name="high">
          <h2>paragraph XXS High <br/>Exemplo de Título</h2>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="xs">
          <h3>paragraph XS <br/>Exemplo de Título</h3>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="xs" ds-name="high">
          <h4>paragraph XS High <br/>Exemplo de Título</h4>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="sm">
          <h5>paragraph SM <br/>Exemplo de Título</h5>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor}>
          <h6>paragraph Base <br/>Exemplo de Título</h6>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="md">
          <h1>paragraph MD <br/>Exemplo de Título</h1>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="lg">
          <h2>paragraph LG <br/>Exemplo de Título</h2>
        </med-paragraph>

        <med-paragraph .dsColor=${dsColor} ds-size="xl">
          <h3>paragraph XL <br/>Exemplo de Título</h3>
        </med-paragraph>
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
