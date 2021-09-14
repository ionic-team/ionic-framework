import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Avatar',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor, dsSize}) => {
  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

        <!-- component -->
        <med-avatar letter="A" .dsColor=${dsColor} ds-size=${dsSize}></med-avatar>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const avatar = TemplateDefault.bind({});
avatar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5247%3A39755',
  },
}
avatar.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsSize: {
    options: [undefined, 'xxs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', 'xxl'],
    control: { type: 'radio'},
    description: "Define a variação de tamanho componente.",
    table: {
      type:  { summary: 'xxs | xs | sm | base | md | lg | xl | xxl' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
