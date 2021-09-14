import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Chart Radial Content',
  decorators: [withDesign],
};

const Default = ({ total, dsColor }) => {

  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
        <med-chart-radial-content .dsColor=${dsColor} total=${total}></med-chart-radial-content>
        <!-- component -->

      </div>
    </ion-content>
  </ion-app>
  `
}

export const ChartRadialContent = Default.bind({});
ChartRadialContent.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
ChartRadialContent.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  total: {
    control: { type: 'text' },
    description: "Define o total de questões.",
    defaultValue: '500',
  },
}
