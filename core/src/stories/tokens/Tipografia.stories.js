import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Tokens/Tipografia',
  decorators: [withDesign],
};

const Template = () => {
  return `
    <style>
      h2 {
        text-align: center;
      }

      span {
        color: hsl(var(--med-color-brand-3));
      }
    </style>

    <h2>⚠️ Para visualizar clique na aba <span>Design</span> abaixo! ⚠️</h2>
  `;
};

export const Tipografia = Template.bind({});
Tipografia.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/4QvnRfhttlJ2hIKQbuEPZl/Tokens?node-id=1191%3A1160',
  },
};
