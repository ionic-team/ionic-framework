import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  isDestructive: boolean;
  isSecondary: boolean;
  isCustom: boolean;
  isSolid: boolean;
  isOutline: boolean;
  isClear: boolean;
  isClicked: boolean;
  myColor1: string;
  myColor2: string;
  multiColor: Array<string>;
  showIf: boolean = true;
  liked: boolean = false;
  value: string;

   public buttons = [
    {selected: false, value: 'primary', text: 'Primary'},
    {selected: false, value: 'secondary', text: 'Secondary'},
    {selected: false, value: 'dark', text: 'Dark'}
  ];

  constructor() {
    this.reset();
  }

  unify() {
    this.isDestructive = false;
    this.isSecondary = false;
    this.isCustom = false;
    this.isSolid = false;
    this.isOutline = false;
    this.isClear = false;
    this.isClicked = false;
    this.myColor1 = 'primary';
    this.myColor2 = 'primary';
  }

  reset() {
    this.isDestructive = true;
    this.isSecondary = true;
    this.isCustom = true;
    this.isSolid = true;
    this.isOutline = true;
    this.isClear = true;
    this.isClicked = false;
    this.myColor1 = 'custom1';
    this.myColor2 = 'custom2';
  }

  toggle() {
    this.isClicked = !this.isClicked;
  }

  reportLike(liked: boolean): void {
    this.liked = liked;
  }

  setValue(value: any) {
    if (this.value !== value) {
      this.buttons.forEach((btn: any) => btn.selected = (value === btn.value));
      this.value = value;
    }
  }

}
