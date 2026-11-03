import { relocateInput } from './common';

describe('relocateInput', () => {
  const render = (html: string) => {
    document.body.innerHTML = html;

    const componentEl = document.body.querySelector('ion-input') as HTMLElement;
    const inputEl = componentEl.querySelector('input') as HTMLInputElement;

    Object.defineProperty(inputEl.parentElement, 'offsetWidth', { value: 300 });
    Object.defineProperty(inputEl, 'offsetLeft', { value: 40 });
    Object.defineProperty(inputEl, 'offsetWidth', { value: 200 });

    return { componentEl, inputEl };
  };

  const INPUT = `<ion-input><div class="native-wrapper"><input /></div></ion-input>`;

  afterEach(() => {
    document.dir = '';
    document.body.innerHTML = '';
  });

  it('should move the input off the right when an ancestor declares rtl', () => {
    const { componentEl, inputEl } = render(`<div dir="rtl">${INPUT}</div>`);

    relocateInput(componentEl, inputEl, true);

    expect(inputEl.style.transform).toBe('translate3d(9999px,0px,0) scale(0)');
    expect((componentEl.querySelector('.cloned-input') as HTMLElement).style.insetInlineStart).toBe('60px');
  });

  it('should move input off the left when an ancestor declares ltr in an rtl document', () => {
    document.dir = 'rtl';
    const { componentEl, inputEl } = render(`<div dir="ltr">${INPUT}</div>`);

    relocateInput(componentEl, inputEl, true);

    expect(inputEl.style.transform).toBe('translate3d(-9999px,0px,0) scale(0)');
    expect((componentEl.querySelector('.cloned-input') as HTMLElement).style.insetInlineStart).toBe('40px');
  });
});
