import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../med-colors'

export default {
  title: 'Components/Examples',
  decorators: [withDesign],
};

const TemplatePrimary = ({ color, disabled, expand, size, dsName }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <div style="margin-bottom: 50px;">
          <ion-button ds-name=${dsName} ?disabled=${disabled} .expand=${expand} ds-size=${size}>brand</ion-button>
        </div>

        <div>
          <ion-button style="margin: 25px;" ds-name=${dsName} color="questoes" ?disabled=${disabled} .expand=${expand} ds-size=${size}>questões</ion-button>
          <ion-button style="margin: 25px;" ds-name=${dsName} color="aula" ?disabled=${disabled} .expand=${expand} ds-size=${size}>aulas</ion-button>
          <ion-button style="margin: 25px;" ds-name=${dsName} color="material" ?disabled=${disabled} .expand=${expand} ds-size=${size}>material</ion-button>
          <ion-button style="margin: 25px;" ds-name=${dsName} color="provaschecklist" ?disabled=${disabled} .expand=${expand} ds-size=${size}>provas</ion-button>
        </div>

        <div>
          <ion-button style="margin-top: 50px;" ds-name=${dsName} .color=${color} ?disabled=${disabled} .expand=${expand} ds-size=${size}>dinamico</ion-button>
        </div>

      </div>
    </ion-app>
  `
}

export const Theme = TemplatePrimary.bind({});
Theme.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}
Theme.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  size: {
    options: [undefined, 'xxs', 'xs', 'sm'],
    control: { type: 'radio'},
    description: "Define o tamanho do botão.",
    table: {
      type:  { summary: 'xxs | xs | sm' },
      defaultValue: { summary: 'undefined' },
    },
  },
  expand: {
    defaultValue: 'none',
    options: [undefined, 'full', 'block'],
    control: { type: 'radio'},
    description: "Define o comportamento 'full' ou 'block' do botão.",
    table: {
      type:  { summary: ['full | block'] },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsName: {
    defaultValue: 'none',
    options: ['primary', 'secondary', 'tertiary'],
    control: { type: 'radio'},
    description: "Define o botão.",
    table: {
      type:  { summary: ['primary | secondary | tertiary'] },
      defaultValue: { summary: 'primary' },
    },
  },
};
