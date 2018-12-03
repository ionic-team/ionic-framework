import { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/global/app.css',
  outputTargets: [
    {
      type: 'www',
      dir: '../../theme-builder',
      serviceWorker: null
    }
  ],
  devServer: {
    root: '../../',
    hotReplacement: false,
    initialLoadUrl: '/theme-builder',
  }
};
