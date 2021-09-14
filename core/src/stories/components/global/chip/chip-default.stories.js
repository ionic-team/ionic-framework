import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Chip',
  decorators: [withDesign],
};

const Template = ({ dsColor, iconLeft, iconRight, slot }) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <ion-chip .dsColor=${dsColor}>
            <ion-label>${slot}</ion-label>
          </ion-chip>

          <ion-chip .dsColor=${dsColor}>
            <ion-icon class="med-icon" name=${iconLeft}></ion-icon>
            <ion-label>${slot}</ion-label>
          </ion-chip>

          <ion-chip .dsColor=${dsColor}>
            <ion-icon class="med-icon" name=${iconLeft}></ion-icon>
            <ion-label>${slot}</ion-label>
            <ion-icon class="med-icon" name=${iconRight}></ion-icon>
          </ion-chip>
          <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
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
  slot: {
    control: { type: 'text' },
    defaultValue: 'UNIFESP 2020',
  },
};
