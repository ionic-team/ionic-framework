import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Accordion List',
  decorators: [withDesign],
};

const Template = ({singleOpen, margin, noBorder}) => {
  return html`
    <style>
      h4 {
        margin: 0;
        color: hsl(var(--med-color-neutral-10));
      }

      p {
        margin: 0;
        color: hsl(var(--med-color-neutral-10));
      }

      .med-accordion__content {
        padding: var(--med-spacing-inset-sm);
      }

      .med-context-menu__list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .med-context-menu__item {
        padding-right: var(--med-spacing-inline-xs);
        margin-bottom: var(--med-spacing-stack-base);
        font-size: var(--med-font-size-xs);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-3));
        display: flex;
        align-items: center;
        transition: color 300ms ease-out;
        cursor: pointer;
      }

      .med-context-menu__icon {
        padding-right: var(--med-spacing-inline-xxxs);
        stroke: hsl(var(--med-color-neutral-3))
      }

      .med-context-menu__info {
        padding: 0;
        margin: 0;
        font-size: var(--med-font-size-xs);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-3));
        padding: var(--med-spacing-inset-xs);
        text-align: center;
      }
    </style>

    <ion-app>
      <ion-content>

        <ion-grid class="sb-container">
          <ion-row>
            <ion-col>

              <!-- component -->
              <med-accordion-list ?no-border=${noBorder} ?single-open=${singleOpen} .margin=${margin}>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 1</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="1"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 2</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.9"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 3</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.8"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 4</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.7"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 5</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.6"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 6</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.5"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 7</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.4"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 8</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.3"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 9</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.2"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

                <med-accordion-item background icon="left">
                  <div slot="header">
                    <h4>Header 10</h4>
                  </div>
                  <med-context-menu class="med-context-menu" slot="button">
                    <ul class="med-context-menu__list">
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-filtro"></ion-icon>
                        <span>Ver filtro selecionado</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                        <span>Renomear Prova</span>
                      </li>
                      <li class="med-context-menu__item">
                        <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                        <span>Excluir Prova</span>
                      </li>
                    </ul>
                    <p class="med-context-menu__info">Criada em 30/12/2020</p>
                  </med-context-menu>

                  <ion-progress-bar slot="progress" ds-name="minimalist" value="0.1"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi quos saepe similique eius illum voluptatibus unde cupiditate sit fuga ea, neque in odit, iste non delectus! Mollitia, ipsam natus delectus maiores veniam quaerat iusto dignissimos beatae cum corporis eaque quod nostrum inventore possimus voluptates dolore velit, praesentium minus adipisci ad enim nihil impedit in rerum. Aut, distinctio velit ab quis iusto dolorum voluptatum reiciendis neque repellendus culpa quo exercitationem corrupti molestiae maxime ut ratione optio. Commodi, vitae obcaecati ullam quis minus consequuntur tempora eum corporis doloribus mollitia voluptatem. Necessitatibus dolor vitae id quia facilis tempore explicabo aliquam quisquam dolores.</p>
                  </div>
                </med-accordion-item>

              </med-accordion-list>
              <!-- component -->

            </ion-col>
          </ion-row>
        </ion-grid>

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
  margin: {
    options: [undefined, 'xs', 'sm', 'md', 'lg'],
    control: { type: 'radio'},
    description: "Define a margin entre os itens do accordion.",
    table: {
      type:  { summary: 'xs | sm | md | lg' },
      defaultValue: { summary: 'undefined' },
    },
  },
  singleOpen: {
    control: { type: 'boolean' },
    description: 'Se `true` apenas um item fica aberto por vez.',
    defaultValue: true,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'true' },
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
};
