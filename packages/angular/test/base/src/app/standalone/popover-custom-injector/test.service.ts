import { Injectable } from '@angular/core';

@Injectable()
export class TestService {
  private value = 'default-value';

  setValue(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
