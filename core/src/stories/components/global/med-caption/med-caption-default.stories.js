import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Caption',
  decorators: [withDesign],
};

const Template = ({dsColor}) => {
  return html`
    <style>
      med-caption {
        margin-bottom: 30px;
      }
    </style>

    <ion-app>
      <ion-content>

        <!-- component -->
        <med-caption .dsColor=${dsColor} ds-size="xxs">
          <span>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</span>
        </med-caption>

        <med-caption .dsColor=${dsColor} ds-size="xs">
          <small>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</small>
        </med-caption>

        <med-caption .dsColor=${dsColor} ds-size="sm">
          <p>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</p>
        </med-caption>

        <med-caption .dsColor=${dsColor}>
          <span>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</span>
        </med-caption>

        <med-caption .dsColor=${dsColor} ds-size="lg">
          <small>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</small>
        </med-caption>

        <med-caption .dsColor=${dsColor} ds-size="xl">
          <p>Este é um texto utilizado para <br/>ilustrar o tramanho do componente</p>
        </med-caption>
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
