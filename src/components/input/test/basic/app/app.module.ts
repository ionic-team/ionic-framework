import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page/root-page';
import { ChatPage } from '../pages/chat-page/chat-page';

@NgModule({
  declarations: [
    AppComponent,
    RootPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
  ],
  entryComponents: [
    RootPage,
    ChatPage
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
