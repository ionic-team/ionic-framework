import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Avatar',
  decorators: [withDesign],
};

const TemplateDefault = ({color, neutral, dsSize}) => {
  return html`

    <ion-app class="storybook-only">
      <ion-content class="storybook-only__container" style="text-align:left;">

        <!-- component -->

        <med-avatar letter="A" .color=${color} .neutral=${neutral} ds-size=${dsSize}></med-avatar>

        <!-- component -->

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
  color: {
    options: medColors,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'inline-radio'},
    description: "Define a cor neutra do componente.",
    table: {
      type:  { summary: 'Neutrals' },
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
