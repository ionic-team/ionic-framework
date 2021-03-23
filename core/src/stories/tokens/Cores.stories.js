import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Tokens/Cores',
  decorators: [withDesign],
};

const TemplateCores = () => {
  return `
    <h2 style="font-family: sans-serif; text-align: center;">
      ⚠️ Para visualizar clique na aba <span style="color: #3a8bd8;">Design</span> abaixo! ⚠️
    </h2>
    <div style="max-width: 576px; width: 100%; margin: 0 auto; font-family: sans-serif;">
      <ul style="list-style: none; text-align: left; margin-bottom: 32px;">
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Brand colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-darkest:</span> <span style="background: #074953; color: #fff; padding: 2px 4px;">#074953;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-darkest-rgb:</span> <span style="background: #074953; color: #fff; padding: 2px 4px;">7, 73, 83;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-dark:</span> <span style="background: #137585; color: #fff; padding: 2px 4px;">#137585;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-dark-rgb:</span> <span style="background: #137585; color: #fff; padding: 2px 4px;">19, 117, 133;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-medium:</span> <span style="background: #3aa8b9; color: #fff; padding: 2px 4px;">#3aa8b9;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-medium-rgb:</span> <span style="background: #3aa8b9; color: #fff; padding: 2px 4px;">58, 168, 185;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-light:</span> <span style="background: #73d6e5; color: #000; padding: 2px 4px;">#73d6e5;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-light-rgb:</span> <span style="background: #73d6e5; color: #000; padding: 2px 4px;">115, 214, 229;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-lightest:</span> <span style="background: #b0ecf5; color: #000; padding: 2px 4px;">#b0ecf5;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-lightest-rgb:</span> <span style="background: #b0ecf5; color: #000; padding: 2px 4px;">176, 236, 245;</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-brand-primary-gradient:</span> <span style="width: 111px; height: 22px; display: inline-block; position: relative; top: 6px; background-image: linear-gradient(to bottom, #3aa8b9, #074953)""></span></li>
        
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Aula colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-darkest:</span> <span style="background: #075344; color: #fff; padding: 2px 4px;">#075344;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-darkest-rgb:</span><span style="background: #075344; color: #fff; padding: 2px 4px;"> 7, 83, 68;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-dark:</span> <span style="background: #13856e; color: #fff; padding: 2px 4px;">#13856e;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-dark-rgb:</span> <span style="background: #13856e; color: #fff; padding: 2px 4px;">19, 133, 110;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-medium:</span> <span style="background: #3ab89f; color: #fff; padding: 2px 4px;">#3ab89f;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-medium-rgb:</span> <span style="background: #3ab89f; color: #fff; padding: 2px 4px;">58, 184, 159;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-light:</span> <span style="background: #73e5cf; color: #fff; padding: 2px 4px;">#73e5cf;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-light-rgb:</span> <span style="background: #73e5cf; color: #fff; padding: 2px 4px;">115, 229, 207;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-lightest:</span> <span style="background: #b0f5e7; color: #000; padding: 2px 4px;">#b0f5e7;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-aula-lightest-rgb:</span> <span style="background: #b0f5e7; color: #000; padding: 2px 4px;">176, 245, 231;</span></li>
      
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Material colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-darkest:</span> <span style="background: #552607; color: #fff; padding: 2px 4px;">#552607;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-darkest-rgb:</span> <span style="background: #552607; color: #fff; padding: 2px 4px;">85, 38, 7;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-dark:</span> <span style="background: #854013; color: #fff; padding: 2px 4px;">#854013;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-dark-rgb:</span> <span style="background: #854013; color: #fff; padding: 2px 4px;">133, 64, 19;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-medium:</span> <span style="background: #b86d3b; color: #000; padding: 2px 4px;">#b86d3b;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-medium-rgb:</span> <span style="background: #b86d3b; color: #000; padding: 2px 4px;">184, 109, 59;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-light:</span> <span style="background: #e5a173; color: #000; padding: 2px 4px;">#e5a173;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-light-rgb:</span> <span style="background: #e5a173; color: #000; padding: 2px 4px;">229, 161, 115;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-lightest:</span> <span style="background: #f5ccb0; color: #000; padding: 2px 4px;">#f5ccb0;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-material-lightest-rgb:</span> <span style="background: #f5ccb0; color: #000; padding: 2px 4px;">245, 204, 176;</span></li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Questões colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-darkest:</span> <span style="background: #073953; color: #fff; padding: 2px 4px;">#073953;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-darkest-rgb:</span> <span style="background: #073953; color: #fff; padding: 2px 4px;">7, 57, 83;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-dark:</span> <span style="background: #135f85; color: #fff; padding: 2px 4px;">#135f85;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-dark-rgb:</span> <span style="background: #135f85; color: #fff; padding: 2px 4px;">19, 95, 133;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-medium:</span> <span style="background: #3a8eb8; color: #fff; padding: 2px 4px;">#3a8eb8;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-medium-rgb:</span> <span style="background: #3a8eb8; color: #fff; padding: 2px 4px;">58, 142, 184;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-light:</span> <span style="background: #73bfe5; color: #fff; padding: 2px 4px;">#73bfe5;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-light-rgb:</span> <span style="background: #73bfe5; color: #fff; padding: 2px 4px;">115, 191, 229;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-lightest:</span> <span style="background: #b0def5; color: #000; padding: 2px 4px;">#b0def5;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-questoes-lightest-rgb:</span> <span style="background: #b0def5; color: #000; padding: 2px 4px;">176, 222, 245;</span></li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Revalida colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-darkest:</span> <span style="background: #53071e; color: #fff; padding: 2px 4px;">#53071e;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-darkest-rgb:</span> <span style="background: #53071e; color: #fff; padding: 2px 4px;">83, 7, 30;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-dark:</span> <span style="background: #851335; color: #fff; padding: 2px 4px;">#851335;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-dark-rgb:</span> <span style="background: #851335; color: #fff; padding: 2px 4px;">133, 19, 53;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-medium:</span> <span style="background: #b83a60; color: #000; padding: 2px 4px;">#b83a60;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-medium-rgb:</span> <span style="background: #b83a60; color: #000; padding: 2px 4px;">184, 58, 96;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-light:</span> <span style="background: #e57395; color: #000; padding: 2px 4px;">#e57395;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-light-rgb:</span> <span style="background: #e57395; color: #000; padding: 2px 4px;">229, 115, 149;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-lightest:</span> <span style="background: #f5b0c5; color: #000; padding: 2px 4px;">#f5b0c5;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-revalida-lightest-rgb:</span> <span style="background: #f5b0c5; color: #000; padding: 2px 4px;">245, 176, 197;</span></li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Provas & Checklist colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-darkest:</span> <span style="background: #2b0755; color: #fff; padding: 2px 4px;">#2b0755;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-darkest-rgb:</span> <span style="background: #2b0755; color: #fff; padding: 2px 4px;">43, 7, 85;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-dark:</span> <span style="background: #481385; color: #fff; padding: 2px 4px;">#481385;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-dark-rgb:</span> <span style="background: #481385; color: #fff; padding: 2px 4px;">72, 19, 133;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-medium:</span> <span style="background: #753bb8; color: #fff; padding: 2px 4px;">#753bb8;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-medium-rgb:</span> <span style="background: #753bb8; color: #fff; padding: 2px 4px;">117, 59, 184;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-light:</span> <span style="background: #a873e5; color: #000; padding: 2px 4px;">#a873e5;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-light-rgb:</span> <span style="background: #a873e5; color: #000; padding: 2px 4px;">168, 115, 229;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-lightest:</span> <span style="background: #d1b2f5; color: #000; padding: 2px 4px;">#d1b2f5;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-provaschecklist-lightest-rgb:</span> <span style="background: #d1b2f5; color: #000; padding: 2px 4px;">209, 178, 245;</span></li>
      
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Neutral Dark Color:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-prime:</span> <span style="background: #141414; color: #fff; padding: 2px 4px;">#141414;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-prime-rgb:</span> <span style="background: #141414; color: #fff; padding: 2px 4px;">20, 20, 20;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-40:</span> <span style="background: #292929; color: #fff; padding: 2px 4px;">#292929;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-40-rgb:</span> <span style="background: #292929; color: #fff; padding: 2px 4px;">41, 41, 41;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-30:</span> <span style="background: #474747; color: #fff; padding: 2px 4px;">#474747;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-30-rgb:</span> <span style="background: #474747; color: #fff; padding: 2px 4px;">71, 71, 71;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-20:</span> <span style="background: #5c5c5c; color: #fff; padding: 2px 4px;">#5c5c5c;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-20-rgb:</span> <span style="background: #5c5c5c; color: #fff; padding: 2px 4px;">92, 92, 92;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-10:</span> <span style="background: #7a7a7a; color: #fff; padding: 2px 4px;">#7a7a7a;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-dark-10-rgb:</span> <span style="background: #7a7a7a; color: #fff; padding: 2px 4px;">122, 122, 122;</span></li>

        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Neutral Light Color:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-prime:</span> <span style="background: #fafafa; color: #000; padding: 2px 4px;">#fafafa;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-prime-rgb:</span> <span style="background: #fafafa; color: #000; padding: 2px 4px;">250, 250, 250;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-40:</span> <span style="background: #ebebeb; color: #000; padding: 2px 4px;">#ebebeb;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-40-rgb:</span> <span style="background: #ebebeb; color: #000; padding: 2px 4px;">235, 235, 235;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-30:</span> <span style="background: #d6d6d6; color: #000; padding: 2px 4px;">#d6d6d6;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-30-rgb:</span> <span style="background: #d6d6d6; color: #000; padding: 2px 4px;">214, 214, 214;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-20:</span> <span style="background: #c2c2c2; color: #000; padding: 2px 4px;">#c2c2c2;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-20-rgb:</span> <span style="background: #c2c2c2; color: #000; padding: 2px 4px;">194, 194, 194;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-10:</span> <span style="background: #adadad; color: #000; padding: 2px 4px;">#adadad;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-light-10-rgb:</span> <span style="background: #adadad; color: #000; padding: 2px 4px;">173, 173, 173;</span></li>

        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-neutral-gradient:</span> <span style="width: 111px; height: 22px; display: inline-block; position: relative; top: 6px; background-image: linear-gradient(to bottom, #141414, #FAFAFA)""></span></li>
        
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Feedback Warning colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-darkest:</span> <span style="background: #504606; color: #fff; padding: 2px 4px;">#504606;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-darkest-rgb:</span> <span style="background: #504606; color: #fff; padding: 2px 4px;">80, 70, 6;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-dark:</span> <span style="background: #857513; color: #000; padding: 2px 4px;">#857513;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-dark-rgb:</span> <span style="background: #857513; color: #000; padding: 2px 4px;">133, 117, 19;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-medium:</span> <span style="background: #b8a73b; color: #000; padding: 2px 4px;">#b8a73b;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-medium-rgb:</span> <span style="background: #b8a73b; color: #000; padding: 2px 4px;">184, 167, 59;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-light:</span> <span style="background: #e5d673; color: #000; padding: 2px 4px;">#e5d673;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-light-rgb:</span> <span style="background: #e5d673; color: #000; padding: 2px 4px;">229, 214, 115;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-lightest:</span> <span style="background: #f5ecb0; color: #000; padding: 2px 4px;">#f5ecb0;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-warning-lightest-rgb:</span> <span style="background: #f5ecb0; color: #000; padding: 2px 4px;">245, 236, 176;</span></li>
      
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Feedback Error colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-darkest:</span> <span style="background: #520c07; color: #fff; padding: 2px 4px;">#520c07;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-darkest-rgb:</span> <span style="background: #520c07; color: #fff; padding: 2px 4px;">82, 12, 7;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-dark:</span> <span style="background: #851a13; color: #fff; padding: 2px 4px;">#851a13;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-dark-rgb:</span> <span style="background: #851a13; color: #fff; padding: 2px 4px;">133, 26, 19;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-medium:</span> <span style="background: #b8433b; color: #000; padding: 2px 4px;">#b8433b;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-medium-rgb:</span> <span style="background: #b8433b; color: #000; padding: 2px 4px;">184, 67, 59;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-light:</span> <span style="background: #e57a73; color: #000; padding: 2px 4px;">#e57a73;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-light-rgb:</span> <span style="background: #e57a73; color: #000; padding: 2px 4px;">229, 122, 115;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-lightest:</span> <span style="background: #f5b5b0; color: #000; padding: 2px 4px;">#f5b5b0;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-error-lightest-rgb:</span> <span style="background: #f5b5b0; color: #000; padding: 2px 4px;">245, 181, 176;</span></li>
        
        <li style="font-weight: 700; font-size: 18px; margin-bottom: 16px; color: #3a8bd8; padding-top: 32px;">Feedback Success colors:</li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-darkest:</span> <span style="background: #065010; color: #fff; padding: 2px 4px;">#065010;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-darkest-rgb:</span> <span style="background: #065010; color: #fff; padding: 2px 4px;">6, 80, 16;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-dark:</span> <span style="background: #138522; color: #fff; padding: 2px 4px;">#138522;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-dark-rgb:</span> <span style="background: #138522; color: #fff; padding: 2px 4px;">19, 133, 34;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-medium:</span> <span style="background: #3bb84b; color: #fff; padding: 2px 4px;">#3bb84b;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-medium-rgb:</span> <span style="background: #3bb84b; color: #fff; padding: 2px 4px;">59, 184, 75;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-light:</span> <span style="background: #73e582; color: #fff; padding: 2px 4px;">#73e582;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-light-rgb:</span> <span style="background: #73e582; color: #fff; padding: 2px 4px;">115, 229, 130;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-lightest:</span> <span style="background: #b0f5b9; color: #000; padding: 2px 4px;">#b0f5b9;</span></li>
        <li style="font-weight: 700; padding-bottom: 8px;"><span style="color: #FF00FF">--med-color-feedback-success-lightest-rgb:</span> <span style="background: #b0f5b9; color: #000; padding: 2px 4px;">176, 245, 185;</span></li>
      </ul>
    </div>
    `;
};

export const Cores = TemplateCores.bind({});
Cores.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/4QvnRfhttlJ2hIKQbuEPZl/Tokens?node-id=1191%3A1346',
  },
}
