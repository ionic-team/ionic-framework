import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Monta Provas/Footer',
  decorators: [withDesign],
};

const Default = ({}) => {
  return html`
    <style>
      .monta-provas-footer {
        background: hsl(var(--med-color-neutral-2));
      }

      .monta-provas-footer__container {
        display: flex;
        align-items: center;
        padding: var(--med-spacing-inset-sm);
        max-width: 1220px;
        margin: 0 auto;
      }

      .monta-provas-footer__col--left {
        flex: 1;
        padding-right: var(--med-spacing-inline-base);
      }

      .monta-provas-footer__auxiliar {
        font-size: var(--med-font-size-nano);
        font-weight: var(--med-font-weight-regular);
        line-height; var(--med-line-height-compressed);
        color: hsl(var(--med-color-neutral-10));
        text-transform: uppercase;
        margin: 0;
      }

      .monta-provas-footer__number {
        font-size: var(--med-font-size-xs);
        font-weight: var(--med-font-weight-semibold);
        line-height; var(--med-line-height-compressed);
        color: hsl(var(--med-color-brand-4));
        text-transform: uppercase;
        margin: 0;
        padding: var(--med-spacing-stack-nano) 0;
      }
    </style>

    <ion-app>
      <ion-container></ion-container>
      <!-- component -->
        <ion-footer class="monta-provas-footer">
          <div class="monta-provas-footer__container">
            <div class="monta-provas-footer__col monta-provas-footer__col--left">
              <p class="monta-provas-footer__auxiliar">seu filtro tem</p>
              <p class="monta-provas-footer__number">224.123</p>
              <p class="monta-provas-footer__auxiliar">questões</p>
            </div>
            <div class="monta-provas-footer__col monta-provas-footer__col--right">
              <ion-button ds-name="primary" ds-size="sm">filtrar</ion-button>
            </div>
          </div>
        </ion-footer>
        <!-- component -->
    </ion-app>
  `
}

export const Footer = Default.bind({});
Footer.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=826%3A1008',
  },
}
Footer.argTypes = {
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
