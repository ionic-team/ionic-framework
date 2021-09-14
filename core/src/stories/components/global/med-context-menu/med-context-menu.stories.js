import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Context Menu',
  decorators: [withDesign],
};

const TemplateDefault = ({ collapsed }) => {
  return html`
    <style>
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

      .med-context-menu__item:hover {
        color: hsl(var(--med-color-neutral-1));
      }

      .med-context-menu__icon {
        padding-right: var(--med-spacing-inline-xxxs);
        stroke: hsl(var(--med-color-neutral-3));
      }

      .med-context-menu__info {
        padding: 0;
        margin: 0;
        font-size: var(--med-font-size-xs);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-5));
        padding: var(--med-spacing-inset-xs);
        text-align: center;
      }
    </style>

    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <med-context-menu class="med-context-menu" .collapsed=${collapsed}>
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
          <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  </ion-app>
  `
}

export const ContextMenu = TemplateDefault.bind({});
ContextMenu.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2781%3A8634',
  },
}
ContextMenu.argTypes = {
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
