import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../../constants';

export default {
  title: 'Components/Team/Monta Provas/Plus Minus',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor}) => {

  return html`
    <style>
    </style>

    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
        <monta-provas-plusminus .dsColor=${dsColor} ds-size="xl">500</monta-provas-plusminus>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const PlusMinus = TemplateDefault.bind({});
PlusMinus.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
  actions: {
    handles: ['medChange'],
  },
}
PlusMinus.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
