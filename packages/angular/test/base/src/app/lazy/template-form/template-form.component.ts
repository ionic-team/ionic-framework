import { Component } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  standalone: false
})
export class TemplateFormComponent {
  inputValue = '';
  textareaValue = '';
  minLengthValue = '';
  
  // Track if form has been submitted
  submitted = false;
  
  onSubmit(form: any) {
    this.submitted = true;
    console.log('Form submitted:', form.value);
    console.log('Form valid:', form.valid);
  }
  
  resetForm(form: any) {
    form.reset();
    this.submitted = false;
  }
}
