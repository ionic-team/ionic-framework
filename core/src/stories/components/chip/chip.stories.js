import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medsoftColors } from '../../med-colors';

export default {
  title: 'Components/Global/Chip',
  decorators: [withDesign],
};

const TemplateDefault = ({ slot, color }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-chip .color=${color}>
          <ion-label>${slot}</ion-label>
        </ion-chip>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Chip = TemplateDefault.bind({});
Chip.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}
Chip.argTypes = {
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  slot: {
    control: { type: 'text' },
    defaultValue: 'chip',
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'button' },
    },
  },
};
