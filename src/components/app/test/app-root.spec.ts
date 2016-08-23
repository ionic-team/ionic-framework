import { ComponentFactoryResolver, ElementRef, Renderer } from '@angular/core';

import { App } from '../app';
import { FeatureDetect } from '../../../util/feature-detect';
import { IonicApp } from '../app-root';
import { mockConfig, mockPlatform } from '../../../util/mock-providers';

describe('app-root', () => {

    it('should set the app appRoot to constructed object', () => {
        // arrange, // act
        let ionicApp = getTestSubject();

        // assert
        expect(mockApp._appRoot).toEqual(ionicApp);
    });


    let mockUserComponent;
    let mockComponentFactoryResolved;
    let mockElementRef;
    let mockRenderer;
    let mockAppRootConfig;
    let mockAppRootPlatform;
    let mockFeatureDetect;
    let mockApp;

    let componentFactory;

    beforeEach(() => {
        componentFactory = {};
        mockUserComponent = <any> { };
        mockComponentFactoryResolved = <ComponentFactoryResolver> <any> {
            resolveComponentFactory: () => {
                return componentFactory;
            }
        };

        mockElementRef = <ElementRef> <any> {
            nativeElement: 'mockNativeElement'
        };

        mockRenderer = <Renderer> <any> {
            setElementClass: () => { }
        };

        mockAppRootConfig = mockConfig();

        mockAppRootPlatform = mockPlatform();

        mockFeatureDetect = <FeatureDetect> <any> {
            test: () => { }
        };

        mockApp = <App> <any> { };
    });

    function getTestSubject(){
        return new IonicApp(
            mockUserComponent,
            mockComponentFactoryResolved,
            mockElementRef,
            mockRenderer,
            mockAppRootConfig,
            mockAppRootPlatform,
            mockFeatureDetect,
            mockApp
        );
    }
});