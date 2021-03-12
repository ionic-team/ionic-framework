export default {
  title: 'Example/Button2',
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
  },
};

const Template = (args) => `
    <ion-button></ion-button>
`

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};