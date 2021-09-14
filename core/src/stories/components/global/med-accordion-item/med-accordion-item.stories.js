import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Accordion Item',
  decorators: [withDesign],
};

const Template = ({dsColor, background, icon, noBorder}) => {
  return html`
    <style>
      h4, p {
        margin: 0;
        color: hsl(var(--med-color-neutral-10));
      }

      .med-accordion__content {
        padding: var(--med-spacing-inset-sm);
      }
    </style>

    <ion-app>
      <ion-content>

        <!-- component -->
        <med-accordion-list single-open="false">
          <med-accordion-item .dsColor=${dsColor} .background=${background} .icon=${icon} ?no-border=${noBorder}>
            <div slot="header">
              <h4>Header</h4>
            </div>
            <div slot="content" class="med-accordion__content">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
            </div>
          </med-accordion-item>
        </med-accordion-list>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2808%3A8916',
  },
}
Default.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  icon: {
    options: [undefined, 'left', 'right'],
    control: { type: 'radio'},
    description: "Define a posição do ícone de abertura do componente.",
    defaultValue: undefined,
    table: {
      type:  { summary: 'left | right' },
      defaultValue: { summary: 'undefined' },
    },
  },
  noBorder: {
    control: { type: 'boolean' },
    description: 'Define a variação da borda do componente.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  background: {
    control: { type: 'boolean' },
    description: 'Define se o componente irá ter background quando aberto.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
