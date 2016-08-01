import { NgModule } from '@angular/core';
import { IonicModule } from '../dist';
import { E2EApp } from './E2EApp.component';

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
