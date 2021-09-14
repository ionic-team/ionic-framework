import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Chip',
  decorators: [withDesign],
};

const Template = ({ dsColor, dsName, iconLeft, iconRight, slot }) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <ion-chip .dsColor=${dsColor} ds-name=${dsName}>
            <ion-label>${slot}</ion-label>
          </ion-chip>

          <ion-chip .dsColor=${dsColor} ds-name=${dsName}>
            <ion-icon class="med-icon" name=${iconLeft}></ion-icon>
            <ion-label>${slot}</ion-label>
          </ion-chip>

          <ion-chip .dsColor=${dsColor} ds-name=${dsName}>
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
  dsName: {
    options: [undefined, 'secondary'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'secondary | transparent' },
      defaultValue: { summary: 'undefined' },
    },
  },
  iconLeft: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-arrow-left-circle',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-arrow-left-circle' },
    },
  },
  iconRight: {
    options: MedIcons,
    control: { type: 'select'},
    defaultValue: 'med-arrow-right-circle',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-arrow-left-circle' },
    },
  },
  slot: {
    control: { type: 'text' },
    defaultValue: 'UNIFESP 2020',
  },
};
