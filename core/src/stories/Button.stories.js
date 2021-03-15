import { html } from 'lit-html';

export default {
  title: 'MyComponent',
}

const Template = ({ first, middle, last }) => {

  return html`<ion-button></ion-button>`

}

export const MyComponent = Template.bind({});

MyComponent.args = {
  first: 'First',
  middle: 'Middle',
  last: 'Last',
};