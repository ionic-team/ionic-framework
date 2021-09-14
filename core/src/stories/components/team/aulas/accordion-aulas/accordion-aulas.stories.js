import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
//import { medColors, medNeutrals } from '../../../../med-colors';

export default {
  title: 'Components/Team/Aulas/Accordion Aulas',
  decorators: [withDesign],
};

const Template = ({color, neutral, icon, noBorder, background}) => {
  return html`
    <style>
      h4, p {
        text-align: left;
        margin: 0;
        color: var(--med-color-neutral-10);
      }

      .med-accordion__content {
        padding-top: 0;
      }
    </style>

    <ion-app>
      <ion-content>

        <ion-grid class="sb-container">
          <ion-row>
            <ion-col>

              <!-- component -->
              <med-accordion-list single-open="false">
                <med-accordion-item .color=${color} .neutral=${neutral} .background=${background} .icon=${icon} ?no-border=${noBorder}>
                  <div slot="header">
                    <h4>Header</h4>
                  </div>

                  <ion-progress-bar ds-name="minimalist" color="aula" slot="auxiliar" value="0.3"></ion-progress-bar>

                  <div slot="content" class="med-accordion__content">
                    <med-item-aulas professor="professor" porcentagem="0.2" videos="20">
                      <med-avatar ds-size="lg" letter="A" slot="avatar"></med-avatar>
                      <med-rate-result excelente="10" bom="20" regular="30" ruim="40" slot="rate"></med-rate-result>
                    </med-item-aulas>
                    <med-item-aulas professor="professor" porcentagem="0.2" videos="20">
                      <med-avatar ds-size="lg" letter="A" slot="avatar"></med-avatar>
                      <med-rate-result excelente="10" bom="20" regular="30" ruim="40" slot="rate"></med-rate-result>
                    </med-item-aulas>
                    <med-item-aulas professor="professor" porcentagem="0.2" videos="20">
                      <med-avatar ds-size="lg" letter="A" slot="avatar"></med-avatar>
                      <med-rate-result excelente="10" bom="20" regular="30" ruim="40" slot="rate"></med-rate-result>
                    </med-item-aulas>
                    <med-item-aulas professor="professor" porcentagem="0.2" videos="20">
                      <med-avatar ds-size="lg" letter="A" slot="avatar"></med-avatar>
                      <med-rate-result excelente="10" bom="20" regular="30" ruim="40" slot="rate"></med-rate-result>
                    </med-item-aulas>
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
  /* color: {
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
  }, */
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
    defaultValue: true,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
