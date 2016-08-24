import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { appNgFactory } from './app.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(appNgFactory);
