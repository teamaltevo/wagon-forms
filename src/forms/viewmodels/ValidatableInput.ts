import { Observable } from 'rxjs';
import { ValidationResult } from './ValidationResult';

export interface ValidatableInput<T> {
  name: string;
  value: T;
  value$: Observable<T>
  validation$: Observable<ValidationResult<T>>;
  onFormValidation(): void;
  clear(): void;
}
