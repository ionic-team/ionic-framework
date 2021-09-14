import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Segment',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor, dsName}) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
        <ion-segment .dsColor=${dsColor} ds-name=${dsName} (ionChange)="segmentChanged($event)">

          <ion-segment-button .dsColor=${dsColor} ds-name=${dsName} value="friends">
            <ion-label>Friends</ion-label>
          </ion-segment-button>

          <ion-segment-button .dsColor=${dsColor} ds-name=${dsName} value="enemies">
            <ion-label>Enemies</ion-label>
          </ion-segment-button>

        </ion-segment>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const segment = TemplateDefault.bind({});
segment.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=3644%3A22',
  },
}
segment.argTypes = {
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
    options: [undefined, 'default'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'default | undefined' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
