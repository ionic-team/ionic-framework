import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/List Item Accordion',
  decorators: [withDesign],
};

const Template = ({ dsColor }) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-list margin="sm">

          <med-list-item .dsColor=${dsColor} titulo="Titulo" label="label">
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

          <med-list-item-accordion .dsColor=${dsColor} titulo="Titulo" label="label">

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

          <med-list-item .dsColor=${dsColor} titulo="Titulo" label="label">
            <ion-checkbox slot="start"></ion-checkbox>
          </med-list-item>

        </med-list>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const ListItemAccordion = Template.bind({});
ListItemAccordion.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=4944%3A34290',
  },
}
ListItemAccordion.argTypes = {
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
