import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostTestService } from '../post-test/post-test.service';

@Component({
  selector: 'app-form-sample-page',
  templateUrl: './form-sample-page.component.html',
  styleUrls: ['./form-sample-page.component.scss']
})
export class FormSamplePageComponent implements OnInit {
  firstName: string;
  lastName: string;
  jobTitle: string;

  drinkBeers: boolean;
  drinkTeas: boolean;
  makeCoffee: boolean;
  feedEngineers: boolean;

  selfDescription: string;
  desiredSalary: number;
  levelOfHappy: number;

  constructor(private postman: PostTestService, private router: Router) { }

  ngOnInit() { }

  save(data: any) {
    this.postman.post(data).subscribe(res => console.log(res));
    this.router.navigate(['home']);
  }
}
