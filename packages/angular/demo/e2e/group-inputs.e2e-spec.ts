import { ElementFinder, promise } from 'protractor/built';

import { GroupInputsPage } from './group-inputs.po';

describe('Group Inputs Page', () => {
  let page: GroupInputsPage;

  beforeEach(() => {
    page = new GroupInputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Group Inputs Demo');
  });
});
