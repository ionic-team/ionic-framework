import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Tokens/Complementares',
  decorators: [withDesign],
};

const TemplateComplementares = () => {
  return `
    <h2 style="font-family: sans-serif; text-align: center;">
    ⚠️ Para visualizar clique na aba <span style="color: #3a8bd8;">Design</span> abaixo! ⚠️
    </h2>
    <div style="max-width: 576px; width: 100%; margin: 0 auto; font-family: sans-serif;">
      <ul style="list-style: none; text-align: left; margin-bottom: 32px;">
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Border Radius:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-none:</span> 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-quark:</span> 2px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-nano:</span> 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-sm:</span> 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-md:</span> 16px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-lg:</span> 24px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-pill:</span> 31.25em;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-full:</span> 50%;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Speech Bubble:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-speech-left-down:</span> 8px 8px 8px 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-speech-right-down:</span> 8px 8px 0 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-speech-right-up:</span> 8px 0 8px 0px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-speech-left-up:</span> 0 8px 8px 0px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Table:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-table-down-sm:</span> 0 0 8px 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-table-up-sm:</span> 8px 8px 0 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-table-down-md:</span> 16px 16px 0 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-radius-table-up-md:</span> 0 0 16px 16px;</li>
      
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Border Widths:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-none:</span> 0;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-quark:</span> 0.25px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-nano:</span> 0.5px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-hairline:</span> 1px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-thin:</span> 2px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-thick:</span> 4px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-bold:</span> 8px;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-border-width-heavy:</span> 16px;</li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Opacity Levels:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-semiopaque:</span> 0.8;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-intense:</span> 0.64;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-half:</span> 0.5;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-medium:</span> 0.32;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-light:</span> 0.16;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-opacity-level-semitransparent:</span> 0.08;</li>
        
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Shadow Levels:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-0:</span> none</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-1:</span> 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.14), 0 1px 3px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-2:</span> 0 2px 4px rgba(0, 0, 0, 0.14), 0 3px 4px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-3:</span> 0 3px 3px rgba(0, 0, 0, 0.14), 0 3px 4px rgba(0, 0, 0, 0.12), 0 1px 8px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-4:</span> 0 0 2px rgba(0, 0, 0, 0.14), 0 4px 5px rgba(0, 0, 0, 0.12), 0 1px 10px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-5:</span> 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12), 0 3px 5px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-6:</span> 0 8px 10px rgba(0, 0, 0, 0.14), 0 3px 14px rgba(0, 0, 0, 0.12), 0 4px 5px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-7:</span> 0 9px 12px rgba(0, 0, 0, 0.14), 0 3px 16px rgba(0, 0, 0, 0.12), 0 5px 6px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-8:</span> 0 12px 17px rgba(0, 0, 0, 0.14), 0 5px 22px rgba(0, 0, 0, 0.12), 0 7px 8px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-9:</span> 0 16px 24px rgba(0, 0, 0, 0.14), 0 6px 30px rgba(0, 0, 0, 0.12), 0 8px 10px rgba(0, 0, 0, 0.2);</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-shadow-level-10:</span> 0 24px 38px rgba(0, 0, 0, 0.14), 0 9px 46px rgba(0, 0, 0, 0.12), 0 11px 15px rgba(0, 0, 0, 0.2);</li>
      </ul>
    </div>
  `;
};

export const Complementares = TemplateComplementares.bind({});
Complementares.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/4QvnRfhttlJ2hIKQbuEPZl/Tokens?node-id=1191%3A1652',
  },
}
