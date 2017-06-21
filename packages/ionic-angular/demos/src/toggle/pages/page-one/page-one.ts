import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  data = {
    frodo: true,
    sam: false,
    eowyn: true,
    legolas: true,
    gimli: false,
    saruman: true,
    gandalf: true,
    arwen: false,
    boromir: false,
    gollum: true,
    galadriel: false
  };
}
