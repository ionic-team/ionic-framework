import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import './med-button.css';

export default {
  title: 'Components/ion-button',
  decorators: [withDesign],
};

const Template = () => {
  return html`
  <ion-app>
    <h2>Estados dos botões</h2>
    <div class="coluna">
      <div class="style">
        <h3>- Default</h3>
        <ion-button>ion button</ion-button>
      </div>

      <div class="style">
        <h3>- Disable</h3>
        <ion-button disabled>ion button</ion-button>
      </div>
    </div>

    <div class="coluna">
      <div class="style">
        <h3>- Focus</h3>
        <ion-button class="ion-focused">ion button</ion-button>
      </div>

      <div class="style">
        <h3>- Activated</h3>
        <ion-button class="ion-activated">ion button</ion-button>
      </div>
    </div>

    <div class="style">
      <h3>- Block</h3>
      <ion-button block>ion button</ion-button>
    </div>

    <div class="style">
      <h3>- Full</h3>
      <ion-button full>ion button</ion-button>
    </div>
  </ion-app>
    `
  }

export const Primary = Template.bind({});
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=729%3A189',
  },
}
