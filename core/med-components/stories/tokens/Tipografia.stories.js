import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Tokens/Tipografia',
  decorators: [withDesign],
};

const TemplateTipografia = () => {
  return `
    <h2 style="font-family: sans-serif; text-align: center;">
    ⚠️ Para visualizar clique na aba <span style="color: #3a8bd8;">Design</span> abaixo! ⚠️
    </h2>
    <div style="max-width: 576px; width: 100%; margin: 0 auto; font-family: sans-serif;">
      <ul style="list-style: none; text-align: left; margin-bottom: 32px;">
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Font family:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-family-brand:</span> "fsemeric";</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-family-base:</span> "fsemeric";</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Font size:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-nano:</span> 10px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xxxs:</span> 12px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xxs:</span> 14px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xs:</span> 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-sm:</span> 20px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-md:</span> 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-lg:</span> 32px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xl:</span> 40px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xxl:</span> 48px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-xxxl:</span> 64px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-size-huge:</span> 96px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Font weight:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-thin:</span> 250;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-light:</span> 300;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-regular:</span> 400;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-medium:</span> 500;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-semibold:</span> 600;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-bold:</span> 700;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-extrabold:</span> 800;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-font-weight-heavy:</span> 900;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Line Height Smart:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-line-height-compressed:</span> 100%;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-line-height-default:</span> ceiling((font-size * 1,3) 8);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-line-height-double:</span> 200%;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 8px; color: #3a8bd8; padding-top: 32px;">Letter Spacing:</li>
        <li style="font-weight: 700; font-size: 14px; margin-bottom: 16px; color: #d83a3a;">Utilizar como variável sass!</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-ultracompressed</span> -0.04;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-compressed</span> -0.02;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-default</span> 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-medium</span> 0.02;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-expanded</span> 0.05;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-distant</span> 0.1;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">$med-letter-spacing-far</span> 0.2;</li>
      </ul>
    </div>
  `;
};

export const Tipografia = TemplateTipografia.bind({});
Tipografia.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/4QvnRfhttlJ2hIKQbuEPZl/Tokens?node-id=309%3A92',
  },
}
