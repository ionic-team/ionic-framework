import { NgFor, JsonPipe } from "@angular/common";
import { Component, DestroyRef, Input, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { merge } from "rxjs";

@Component({
  selector: 'app-value-accessor-test',
  templateUrl: 'value-accessor-test.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    NgFor
  ]
})
export class ValueAccessorTestComponent {
  private destroyRef = inject(DestroyRef);

  // Mirror the form's value/validity into signals so the displayed state
  // re-renders under OnPush (the Angular 22 default) when the bound Ionic
  // value accessor updates the form.
  readonly value = signal<Record<string, unknown>>({});
  readonly valid = signal(false);
  readonly controls = signal<{ key: string; valid: boolean }[]>([]);

  private _formGroup!: FormGroup;

  @Input({ required: true })
  set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;

    const sync = () => {
      this.value.set(formGroup.value);
      this.valid.set(formGroup.valid);
      this.controls.set(
        Object.entries(formGroup.controls).map(([key, control]) => ({
          key,
          valid: (control as AbstractControl).valid,
        }))
      );
    };

    sync();
    merge(formGroup.valueChanges, formGroup.statusChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sync);
  }
  get formGroup(): FormGroup {
    return this._formGroup;
  }
}
