import { NgModule } from '@angular/core';
import { IonicModule } from '../dist';
import { E2EApp } from './E2EApp.component';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        E2EApp
                    ],
                    imports: [
                        IonicModule.forRoot(E2EApp)
                    ],
                    entryComponents: [
                        E2EApp
                    ]
                },] },
    ];
    return AppModule;
}());
