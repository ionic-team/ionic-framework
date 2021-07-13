import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Accordion',
  decorators: [withDesign],
};

const TemplateDefault = ({size, icon, collapsed}) => {
  return html`
    <style>
      h4 {
        text-align: left;
        margin: 0;
      }

      p {
        text-align: left;
        margin: 0;
      }

      .med-accordion__content {
        padding: var(--med-spacing-inset-sm);
        padding-top: 0;
      }
    </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-accordion class="med-accordion" .size=${size} .icon=${icon} .collapsed=${collapsed}>

            <div slot="header">
              <h4>Header</h4>
            </div>

            <div slot="content-fake" class="med-accordion__content">
              <p>Conteúdo em 1 linha que pode ser expandi…</p>
            </div>

            <div slot="content" class="med-accordion__content">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
            </div>

          </med-accordion>
        <!-- component -->

      <ion-content>
    </ion-app>
  `
}

export const Accordion = TemplateDefault.bind({});
Accordion.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
}
Accordion.argTypes = {
  size: {
    options: [undefined, 'full'],
    control: { type: 'radio'},
    description: "Aplica tamanho fullscreen.",
    table: {
      type:  { summary: 'full' },
      defaultValue: { summary: 'undefined' },
    },
  },
  icon: {
    options: [undefined, 'left', 'right'],
    control: { type: 'radio'},
    description: "Define a posição do ícone.",
    table: {
      type:  { summary: 'left | right' },
      defaultValue: { summary: 'undefined' },
    },
  },
  collapsed: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente.',
    defaultValue: true,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'true' },
    },
  },
};
