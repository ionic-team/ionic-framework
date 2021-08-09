import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';
import { medIcons } from '../../../med-icons';

export default {
  title: 'Components/Core/Chip',
  decorators: [withDesign],
};

const Template = ({ color, neutral, iconLeft, iconRight, slot }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-chip ds-name="secondary" .color=${color} .neutral=${neutral}>
          <ion-label>${slot}</ion-label>
        </ion-chip>

        <ion-chip ds-name="secondary" .color=${color} .neutral=${neutral}>
          <ion-icon class="med-icon" name=${iconLeft}></ion-icon>
          <ion-label>${slot}</ion-label>
        </ion-chip>

        <ion-chip ds-name="secondary" .color=${color} .neutral=${neutral}>
          <ion-icon class="med-icon" name=${iconLeft}></ion-icon>
          <ion-label>${slot}</ion-label>
          <ion-icon class="med-icon" name=${iconRight}></ion-icon>
        </ion-chip>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Secondary = Template.bind({});
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}
Secondary.argTypes = {
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
  iconLeft: {
    options: medIcons,
    control: { type: 'select'},
    defaultValue: 'med-arrow-left-circle',
    description: '**Atributo utilizado apenas no storybook. Não é um atributo do componente!.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-arrow-left-circle' },
    },
  },
  iconRight: {
    options: medIcons,
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
