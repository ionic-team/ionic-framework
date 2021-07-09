import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Accordion',
  decorators: [withDesign],
};

const TemplateDefault = ({size}) => {
  return html`
    <style>
      .list {
        display: flex;
        list-style: none;
        flex-wrap: wrap;
        justify-content: center;
      }
      .list__item {
        margin: 8px;
      }
      .list__span {
        display: block;
        font-size: 14px;
        font-weight: 500;
      }
      ion-icon {
        font-size: 28px;
      }
    </style>

    <ion-app>
      <!-- component -->
        <med-accordion .size=${size} simple>
          <div slot="header">
            <ion-badge>CIR</ion-badge>
            <h4>Trauma</h4>
          </div>
          <p slot="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quis assumenda similique, veniam dicta voluptatem debitis quidem accusamus! Sequi libero nihil quod. Ratione fugit quo alias in facilis, error rerum? Laboriosam eveniet ex deleniti iste a minima minus magnam libero, voluptates ullam veritatis explicabo voluptas? Illo nesciunt fugiat odit omnis voluptatem, officiis, vel voluptate, reprehenderit cupiditate consequuntur magni nihil inventore animi similique esse a officia harum tempore dolor sapiente rem tempora cum minima voluptatum? Velit, adipisci quasi animi necessitatibus reprehenderit rem vel nulla. Delectus eaque neque natus illum nostrum. Veniam cupiditate ex aperiam iusto voluptas inventore tenetur reiciendis aliquam obcaecati?</p>
        </med-accordion>
      <!-- component -->
    </ion-app>
  `
}

export const Simple = TemplateDefault.bind({});
Simple.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2802%3A8897',
  },
}
Simple.argTypes = {
  size: {
    options: [undefined, 'full'],
    control: { type: 'radio'},
    description: "Aplica tamanho fullscreen.",
    table: {
      type:  { summary: 'full' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
