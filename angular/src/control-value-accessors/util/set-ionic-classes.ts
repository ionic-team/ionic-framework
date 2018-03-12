import { ElementRef } from '@angular/core';

export function setIonicClasses(element: ElementRef) {
  const classList = element.nativeElement.classList;

  classList.remove('ion-invalid');
  classList.remove('ion-valid');
  classList.remove('ion-touched');
  classList.remove('ion-untouched');
  classList.remove('ion-dirty');
  classList.remove('ion-pristine');
  classList.forEach((cls: string) => {
    if (cls === 'ng-invalid') { classList.add('ion-invalid'); }
    if (cls === 'ng-valid') { classList.add('ion-valid'); }
    if (cls === 'ng-touched') { classList.add('ion-touched'); }
    if (cls === 'ng-untouched') { classList.add('ion-untouched'); }
    if (cls === 'ng-dirty') { classList.add('ion-dirty'); }
    if (cls === 'ng-pristine') { classList.add('ion-pristine'); }
  });
}
