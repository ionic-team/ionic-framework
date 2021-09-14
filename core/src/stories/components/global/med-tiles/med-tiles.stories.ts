import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Tiles',
  decorators: [withDesign],
};

const Template = ({ dsColor, titulo, label, badge, selected, solid }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-tiles .dsColor=${dsColor} .titulo=${titulo} .label=${label} .badge=${badge} .selected=${selected} .solid=${solid}>
          <ion-button ds-name="primary" ds-size="xxxs">teste</ion-button>
        </med-tiles>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Tiles = Template.bind({});
Tiles.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4944%3A34290',
  },
}
Tiles.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  titulo: {
    control: { type: 'text' },
    defaultValue: 'Teste',
  },
  label: {
    control: { type: 'text' },
    defaultValue: 'Teste',
  },
  badge: {
    control: { type: 'text' },
    defaultValue: 'BADGE',
  },
  selected: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
};
