import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Heading',
  decorators: [withDesign],
};

const Template = ({dsColor}) => {
  return html`
    <style>
      med-heading {
        margin-bottom: 30px;
      }
    </style>

    <ion-app>
      <ion-content>

        <!-- component -->
        <med-heading .dsColor=${dsColor} ds-size="xxs">
          <h1>Heading XXS <br/>Exemplo de Título</h1>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="xxs" ds-name="high">
          <h2>Heading XXS High <br/>Exemplo de Título</h2>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="xs">
          <h3>Heading XS <br/>Exemplo de Título</h3>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="xs" ds-name="high">
          <h4>Heading XS High <br/>Exemplo de Título</h4>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="sm">
          <h5>Heading SM <br/>Exemplo de Título</h5>
        </med-heading>

        <med-heading .dsColor=${dsColor}>
          <h6>Heading Base <br/>Exemplo de Título</h6>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="md">
          <h1>Heading MD <br/>Exemplo de Título</h1>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="lg">
          <h2>Heading LG <br/>Exemplo de Título</h2>
        </med-heading>

        <med-heading .dsColor=${dsColor} ds-size="xl">
          <h3>Heading XL <br/>Exemplo de Título</h3>
        </med-heading>
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
