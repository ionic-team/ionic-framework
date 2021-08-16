import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Tiles',
  decorators: [withDesign],
};

const Template = ({ color, neutral, titulo, label, badge, selected, solid }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-tiles .color=${color} .neutral=${neutral} .titulo=${titulo} .label=${label} .badge=${badge} .selected=${selected} .solid=${solid}>
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
  color: {
    options: medColors,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'inline-radio'},
    description: "Define a cor neutra do componente.",
    table: {
      type:  { summary: 'Neutrals' },
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
