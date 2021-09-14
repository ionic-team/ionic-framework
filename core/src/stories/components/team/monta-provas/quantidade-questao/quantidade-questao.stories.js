import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Quantidade Questão',
  decorators: [withDesign],
};

const TemplateDefault = ({valores}) => {

  setTimeout(() => {
    document.querySelector('med-chart-radial').valores = valores.valores;
    document.querySelector('med-chart-radial-label').valores = valores.valores;
  }, 1000);

  return html`
    <style>
      .monta-provas-quantidade-questao {
        display: block;
        max-width: 1200px;
        padding: var(--med-spacing-stretch-md);
        background: var(--med-color-neutral-2);
        border-radius: var(--med-border-radius-sm);
      }

      .monta-provas-quantidade-questao__heading {
        font-size: var(--med-font-size-xs);
        font-weight: var(--med-font-weight-medium);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-10));
      }

      .monta-provas-quantidade-questao__auxiliar {
        font-size: var(--med-font-size-xxs);
        font-weight: var(--med-font-weight-medium);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-7));
      }

      .monta-provas-quantidade-questao__questoes {
        font-size: var(--med-font-size-xs);
        font-weight: var(--med-font-weight-bold);
        line-height: var(--med-line-height-compressed);
        color: hsl(var(--med-color-brand-5));
        margin-top: var(--med-spacing-stack-xs);
        margin-bottom: var(--med-spacing-stack-xxxs);
      }

      .monta-provas-quantidade-questao__heading:nth-of-type(:first-of-type) {
        margin-bottom: var(--med-spacing-stack-base);
      }

      .monta-provas-quantidade-questao__heading:nth-of-type(:second-of-type) {
        margin: var(--med-spacing-stack-base) 0;
      }
    </style>

    <ion-app>
      <ion-content>
        <div class="flex-center" style="text-align:center;">

        <!-- component -->
        <div class="monta-provas-quantidade-questao">
          <p class="monta-provas-quantidade-questao__heading">Sua prova possui</p>
          <monta-provas-plusminus>500</monta-provas-plusminus>
          <p class="monta-provas-quantidade-questao__heading">questões</p>
          <p class="monta-provas-quantidade-questao__auxiliar">de um  total de 32.240 questões filtradas. Aumente o número de questões.</p>
          <p class="monta-provas-quantidade-questao__questoes">33140 questões</p>
          <p class="monta-provas-quantidade-questao__auxiliar">restantes no filtro selecionado</p>
        </div>
        <!-- component -->

        </div>
      </ion-content>
    </ion-app>
  `
}

export const QuantidadeQuestao = TemplateDefault.bind({});
QuantidadeQuestao.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
QuantidadeQuestao.argTypes = {
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
