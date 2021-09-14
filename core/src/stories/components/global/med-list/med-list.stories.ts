import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/List',
  decorators: [withDesign],
};

const Template = ({ dsColor, titulo, label, selected }) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-list margin="sm">
          <med-list-item .dsColor=${dsColor} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item .dsColor=${dsColor} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item-accordion .dsColor=${dsColor} .titulo=${titulo} .label=${label} .selected=${selected}>

            <ion-checkbox slot="start"></ion-checkbox>

            <med-list-item .dsColor=${dsColor} slot="end" titulo="Titulo" label="label">
              <ion-checkbox slot="start"></ion-checkbox>
            </med-list-item>
            <med-list-item .dsColor=${dsColor} slot="end" titulo="Titulo" label="label">
              <ion-checkbox slot="start"></ion-checkbox>
            </med-list-item>
            <med-list-item .dsColor=${dsColor} slot="end" titulo="Titulo" label="label">
              <ion-checkbox slot="start"></ion-checkbox>
            </med-list-item>

          </med-list-item-accordion>

          <med-list-item .dsColor=${dsColor} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item .dsColor=${dsColor} .titulo=${titulo} .label=${label} .selected=${selected}>
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>
        </med-list>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const List = Template.bind({});
List.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4944%3A34290',
  },
}
List.argTypes = {
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
