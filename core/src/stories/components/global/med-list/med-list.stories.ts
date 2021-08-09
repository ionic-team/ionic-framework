import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/List',
  decorators: [withDesign],
};

const Template = ({ color, neutral, titulo, label, selected }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-list margin="lg">
          <med-list-item .color=${color} .neutral=${neutral} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item .color=${color} .neutral=${neutral} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item .color=${color} .neutral=${neutral} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item .color=${color} .neutral=${neutral} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>
        </med-list>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ListItem = Template.bind({});
ListItem.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4944%3A34290',
  },
}
ListItem.argTypes = {
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
