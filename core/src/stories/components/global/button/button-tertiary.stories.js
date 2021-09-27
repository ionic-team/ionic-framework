import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Button/Tertiary',
  decorators: [withDesign],
};

const Template = ({ dsColor, disabled, expand, dsSize, iconLeft, iconRight, iconOnly, slot }) => {
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
          <ion-button ds-name="tertiary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize}>${slot}</ion-button>

          <ion-button ds-name="tertiary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize}>
            <ion-icon slot="start" class="med-icon" name=${iconLeft}></ion-icon>
            ${slot}
          </ion-button>

          <ion-button ds-name="tertiary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize}>
            ${slot}
            <ion-icon slot="end" class="med-icon" name=${iconRight}></ion-icon>
          </ion-button>

          <ion-button ds-name="tertiary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize}>
            <ion-icon slot="start" class="med-icon" name=${iconLeft}></ion-icon>
            ${slot}
            <ion-icon slot="end" class="med-icon" name=${iconRight}></ion-icon>
          </ion-button>

          <ion-button ds-name="tertiary" .dsColor=${dsColor} ?disabled=${disabled} .expand=${expand} ds-size=${dsSize}>
            <ion-icon slot="icon-only" class="med-icon" name=${iconOnly}></ion-icon>
          </ion-button>
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
