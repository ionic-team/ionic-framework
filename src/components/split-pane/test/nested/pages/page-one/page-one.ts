import { Component } from '@angular/core';

import { PageTwo } from '../page-two/page-two';
import { PageThree } from '../page-three/page-three';
import { PageFour } from '../page-four/page-four';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  root = PageTwo;
  root2 = PageThree;
  root3 = PageFour;
}
