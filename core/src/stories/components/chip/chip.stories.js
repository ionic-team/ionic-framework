import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Chip',
  decorators: [withDesign],
};

const TemplateDefault = ({ label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-chip>
          <ion-label>${label}</ion-label>
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
  label: {
    control: { type: 'text' },
    defaultValue: 'chip',
    description: "Digite algo!",
    table: {
      type: { summary: 'Atributo para testes no storybook apenas' },
    },
  },
};
