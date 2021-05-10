import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconlabel = ({ disabled }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          próxima
          <ion-icon name="med-arrow-left-circle" slot="start"></ion-icon>
        </ion-button>
        <!-- component -->

        <div style="width: 100%;"></div>

        <!-- component -->
        <ion-button ds-name="icon-label" ?disabled=${disabled}>
          <ion-icon name="med-arrow-right-circle" slot="end"></ion-icon>
          próxima
        </ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const IconLabel = TemplateIconlabel.bind({});
IconLabel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1619%3A594',
  },
}
IconLabel.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.'
  },
};
