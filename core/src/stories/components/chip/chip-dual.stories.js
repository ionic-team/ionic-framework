import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medIcons } from '../../med-icons';

export default {
  title: 'Components/Global/Chip',
  decorators: [withDesign],
};

const TemplateDual = ({ label, iconName }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-chip>
          <ion-icon name=${iconName}></ion-icon>
          <ion-label>${label}</ion-label>
          <ion-icon name=${iconName}></ion-icon>
        </ion-chip>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ChipDualIcon = TemplateDual.bind({});
ChipDualIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}
ChipDualIcon.argTypes = {
  iconName: {
    options: medIcons,
    control: { type: 'select'},
    defaultValue: 'med-check-circle',
    description: "Mude o ícone!",
    table: {
      type:  { summary: 'Atributo para testes no storybook apenas' },
    },
  },
  label: {
    control: { type: 'text' },
    defaultValue: 'chip',
    description: "Digite algo!",
    table: {
      type: { summary: 'Atributo para testes no storybook apenas' },
    },
  },
};
