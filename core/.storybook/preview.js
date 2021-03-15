import { defineCustomElements} from '../loader/index.js';

defineCustomElements() 

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}