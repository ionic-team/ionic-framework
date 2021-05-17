import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors } from '../../med-colors'

export default {
  title: 'Components/Global/Badge/Default',
  decorators: [withDesign],
};

const TemplateDefault = ({ color, fill, size }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-badge .color=${color} fill=${fill} ds-size=${size}>ion-badge</ion-badge>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1972%3A356',
  },
}
Default.argTypes = {
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do badge baseado nos tokens.",
    table: {
      type:  { summary: 'Qualquer cor do Design System' },
      defaultValue: { summary: 'undefined' },
    },
  },
  fill: {
    options: [undefined, 'outline'],
    control: { type: 'radio'},
    description: "Define o comportamento de fill do badge.",
    table: {
      type:  { summary: 'outline' },
      defaultValue: { summary: 'undefined' },
    },
  },
  size: {
    options: [undefined, 'sm', 'md', 'lg'],
    control: { type: 'radio'},
    description: "Define o tamanho do badge.",
    table: {
      type:  { summary: 'sm | md | lg' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
