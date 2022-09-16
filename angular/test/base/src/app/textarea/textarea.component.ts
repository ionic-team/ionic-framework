
import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
})
export class TextareaComponent {

  form = this.fb.group({
    textarea: ['', Validators.required]
  })

  constructor(private fb: UntypedFormBuilder) { }

}
