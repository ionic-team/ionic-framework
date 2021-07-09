import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Accordion',
  decorators: [withDesign],
};

const TemplateDefault = ({size}) => {
  return html`
    <ion-app>
      <ion-grid>
        <ion-row>
          <ion-col>

          <!-- component -->
            <med-accordion .size=${size}>
            <div slot="header">
              <ion-badge>CIR</ion-badge>
              <h4>Trauma</h4>
              <p>Barreira comportamental</p>
            </div>
            <div slot="content">
              <ion-badge>CIR</ion-badge>
              <ion-badge>CIR</ion-badge>
              <ion-badge>CIR</ion-badge>
              <div>
                <ion-button ds-name="secondary">Secondary Button</ion-button>
              </div>
            </div>
            </med-accordion>
          <!-- component -->

          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-app>
  `
}

export const MedRevisao = TemplateDefault.bind({});
MedRevisao.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
}
MedRevisao.argTypes = {
  size: {
    options: [undefined, 'full'],
    control: { type: 'radio'},
    description: "Aplica tamanho fullscreen.",
    table: {
      type:  { summary: 'full' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
