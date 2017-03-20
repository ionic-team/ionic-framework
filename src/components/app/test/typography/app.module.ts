import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, App } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class AppComponent {
  constructor(app: App) {
    app.setTitle('Basic Buttons');
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
