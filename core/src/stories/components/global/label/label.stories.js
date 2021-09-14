import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedLabels } from '../../../constants';

export default {
  title: 'Components/Core/Label',
  decorators: [withDesign],
};

const TemplateDefault = ( { dsName, label }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-label ds-name=${dsName}>${label}</ion-label>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Label = TemplateDefault.bind({});
Label.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}
Label.argTypes = {
  dsName: {
    options: MedLabels,
    control: { type: 'select'},
    defaultValue: 'helper',
    description: "Define o estilo estilo do label dentro do DS.",
    table: {
      type:  { summary: 'stacked | helper' },
      defaultValue: { summary: 'undefined' },
    },
  },
  label: {
    control: { type: 'text' },
    defaultValue: 'DS label',
    description: "Digite algo!",
    table: {
      type: { summary: 'Atributo para testes no storybook apenas' },
    },
  },
}
