import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Back Button/Secondary',
  decorators: [withDesign],
};

const Template = ({ dsColor, disabled, expand, dsSize, iconOnly, slot }) => {
  return html`
    <style>
      ion-button {
        margin: 5px 15px;
      }
    </style>
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
        <ion-back-button ds-name="secondary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize} icon=${iconOnly}></ion-back-button>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Secondary = Template.bind({});
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=6232%3A46685',
  },
}
Secondary.argTypes = {
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
    options: [undefined, 'sm', 'xs', 'xxs', 'xxxs - utilizado apenas em botões sem ícone'],
    control: { type: 'radio'},
    description: "Define a variação de tamanho componente.",
    table: {
      type:  { summary: 'sm' | 'xs' | 'xxs' | 'xxxs - utilizado apenas em botões sem ícone' },
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
  iconLeft: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-setaesquerda',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-setaesquerda' },
    },
  },
  iconRight: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-setadireita',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-setadireita' },
    },
  },
  iconOnly: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-fechar',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-fechar' },
    },
  },
  slot: {
    control: { type: 'text' },
    defaultValue: 'button',
  },
};
