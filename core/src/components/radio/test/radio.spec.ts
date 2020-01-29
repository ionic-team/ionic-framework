import { Radio } from '../radio.tsx';

describe('ion-radio', () => {
  it('should set a default value', async () => {
    const radio = new Radio();

    await radio.connectedCallback();

    expect(radio.value).toEqual('ion-rb-0');    
  });
});