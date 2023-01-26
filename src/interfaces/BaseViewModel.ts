import { Observable } from 'rxjs';
import { ValidationResult } from './ValidationResult';

export interface BaseViewModel<T> {
  name: string;
  value: T;
  value$: Observable<T>
  validation$: Observable<ValidationResult<T>>;
  errors$: Observable<string[] | undefined>
  disabled: boolean;
  readonly: boolean;
  onFormValidation(): void;
  clear(): void;
}
