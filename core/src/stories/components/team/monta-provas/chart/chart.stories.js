import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Chart',
  decorators: [withDesign],
};

const TemplateDefault = ({valores}) => {

  setTimeout(() => {
    document.querySelector('med-chart-radial').valores = valores.valores;
    document.querySelector('med-chart-radial-label').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      .med-accordion-header {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .med-accordion-header__heading {
        font-size: var(--med-font-size-xs);
        font-weight: var(--med-font-weight-semibold);
        line-height: var(--med-line-height-default);
        color: hsl(var(--med-color-neutral-10));
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: center;
      }

      .monta-provas-chart {
        background: hsl(var(--med-color-neutral-2));
        padding: 0 var(--med-spacing-stretch-md);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-width: 400px;
        margin: 0 auto;
      }

      .monta-provas-chart-content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: var(--med-line-height-compressed);
        text-align: center;
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

        <!-- component -->
        <med-accordion-list accordion-list single-open="false">
          <med-accordion-item icon="left">
            <div class="med-accordion-header" slot="header">
              <h4 class="med-accordion-header__heading">Nome da Prova</h4>
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

            <div class="monta-provas-chart" slot="content">
              <med-chart-radial>
                <med-chart-radial-content class="monta-provas-chart-content" total="999999"></med-chart-radial-content>
              </med-chart-radial>

              <med-chart-radial-label class="monta-provas-chart__label"></med-chart-radial-label>
            </div>
          </med-accordion-item>
        </med-accordion-list>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Chart = TemplateDefault.bind({});
Chart.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
Chart.argTypes = {
  valores: {
    defaultValue: {
      valores: [
        {
          cor: 'ion-color-success',
          label: 'Acertos',
          quantia: 32,
          ignoreBarra: false,
        },
        {
          cor: 'ion-color-caution',
          label: 'Erros',
          quantia: 16,
          ignoreBarra: false,
        },
        {
          cor: '',
          label: 'Restantes',
          quantia: 52,
          ignoreBarra: true,
        }
      ],
    },
    control: { type: 'array' },
    description: 'Define a lista...',
    table: {
      type:  { summary: 'MedRadialItem[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
}
