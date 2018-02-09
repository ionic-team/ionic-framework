import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { HomePage } from '../../../e2e/home.po';

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

  constructor(private router: Router) { }

  ngOnInit() { }

  save() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      title: this.jobTitle,
      beer: this.drinkBeers,
      tea: this.drinkTeas,
      coffee: this.makeCoffee,
      feed: this.feedEngineers,
      description: this.selfDescription,
      salary: this.desiredSalary,
      happy: this.levelOfHappy
    };
    console.log('I would submit: ', data);
    this.router.navigate(['home']);
  }
}
