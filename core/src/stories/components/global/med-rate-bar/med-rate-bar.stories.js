import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Rate Bar',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-rate-bar .dsColor=${dsColor}>
          Avalie esse vídeo
          <med-rate-like slot="avaliacao"></med-rate-like>
        </med-rate-bar>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const RateBar = TemplateDefault.bind({});
RateBar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
  actions: {
    handles: ['medChange'],
  },
}
RateBar.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
