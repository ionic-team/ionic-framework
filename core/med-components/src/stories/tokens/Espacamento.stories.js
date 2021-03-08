import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Tokens/Espacamento',
  decorators: [withDesign],
};

const TemplateEspacamento = () => {
  return `
    <h2 style="font-family: sans-serif; text-align: center;">
    ⚠️ Para visualizar clique na aba <span style="color: #3a8bd8;">Design</span> abaixo! ⚠️
    </h2>
    <div style="max-width: 576px; width: 100%; margin: 0 auto; font-family: sans-serif;">
      <ul style="list-style: none; text-align: left; margin-bottom: 32px;">
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Spacing Inset:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-nano:</span> 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-xs:</span> 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-sm:</span> 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-base:</span> 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-md:</span> 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-lg:</span> 40px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-xl:</span> 48px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inset-xxl:</span> 64px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Spacing Squish:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-nano:</span> 4px 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-xs:</span> 8px 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-sm:</span> 8px 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-base:</span> 8px 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-md:</span> 16px 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-lg:</span> 16px 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-xl:</span> 24px 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-squish-xxl:</span> 32px 40px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Spacing Stretch:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-nano:</span> 8px 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-xs:</span> 16px 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-sm:</span> 24px 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-base:</span> 32px 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-md:</span> 24px 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-lg:</span> 32px 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-xl:</span> 32px 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stretch-xxl:</span> 40px 32px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Spacing Inline:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-quark:</span> 2px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-nano:</span> 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xxxs:</span> 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-base:</span> 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xxs:</span> 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xs:</span> 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-sm:</span> 40px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-md:</span> 48px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-lg:</span> 56px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xl:</span> 64px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xxl:</span> 72px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-xxxl:</span> 80px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-huge:</span> 120px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-inline-ultra:</span> 160px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Spacing Stack:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-quark:</span> 2px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-nano:</span> 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xxxs:</span> 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-base:</span> 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xxs:</span> 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xs:</span> 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-sm:</span> 40px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-md:</span> 48px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-lg:</span> 56px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xl:</span> 64px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xxl:</span> 72px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-xxxl:</span> 80px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-huge:</span> 120px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-spacing-stack-ultra:</span> 160px;</li>
      </ul>
    </div>
  `;
};

export const Espacamento = TemplateEspacamento.bind({});
Espacamento.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/4QvnRfhttlJ2hIKQbuEPZl/Tokens?node-id=563%3A472',
  },
}
