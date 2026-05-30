
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  standalone: false
})
export class TextareaComponent {

  form = this.fb.group({
    textarea: ['', Validators.required]
  })

  constructor(private fb: FormBuilder) { }

}
