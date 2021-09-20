import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Back Button',
  decorators: [withDesign],
};

const Template = ({ dsName, dsColor, solid, disabled, expand, dsSize, iconOnly }) => {
  return html`
    <style>
      ion-back-button {
        display: inline-block;
      }
    </style>
    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <ion-back-button .dsName=${dsName} .dsColor=${dsColor} ?solid=${solid} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize} icon=${iconOnly}></ion-back-button>
          <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Tertiary = Template.bind({});
Tertiary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=6232%3A46685',
  },
}
Tertiary.argTypes = {
  dsName: {
    options: [undefined, 'secondary', 'tertiary'],
    control: { type: 'radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do componente.',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsSize: {
    options: [undefined, 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs'],
    control: { type: 'radio'},
    description: "Define a variação de tamanho componente.",
    table: {
      type:  { summary: 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'xxxs' },
      defaultValue: { summary: 'undefined' },
    },
  },
  expand: {
    defaultValue: 'none',
    options: [undefined, 'full', 'block'],
    control: { type: 'radio'},
    description: "Define a variação de estilo do componente.",
    table: {
      type:  { summary: ['full | block'] },
      defaultValue: { summary: 'undefined' },
    },
  },
  iconOnly: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-esquerda',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-esquerda' },
    },
  },
};
