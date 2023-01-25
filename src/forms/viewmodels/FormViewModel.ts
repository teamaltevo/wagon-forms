import { Observable, combineLatest, throwError } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { FormValidationError } from '../errors/FormValidationError';
import { ValidatableInput } from './ValidatableInput';
import { ValidationResult } from './ValidationResult';

type FormDataObject = { [key: string]: any };

export abstract class FormViewModel<T extends FormDataObject> {

  public abstract getInputs(): ValidatableInput<unknown>[];

  private get validation$(): Observable<ValidationResult<unknown>[]> {
    return combineLatest(this.getInputs().map(input => input.validation$));
  }

  public get isValid$(): Observable<boolean> {
    return this.validation$.pipe(
      tap(results => console.log(results)),
      map(results => results.every(r => r.result))
    )
  }

  public validateForm(): Observable<T> {
    const inputs = this.getInputs();
    if (inputs.length === 0) {
      throw new FormValidationError('Form does not have any inputs');
    }

    inputs.forEach(input => input.onFormValidation());
    return this.validation$.pipe(
      first(),
      map(results => {
        if (results.every(r => r.result)) {
          return results.reduce((acc, r) => ({ ...acc, [r.field]: r.value }), {}) as T;
        } else {
          throw new FormValidationError(
            'One or more fields of this form are invalid, check error.cause for details.',
            results.filter(r => !r.result).map(r => ({ field: r.field, errors: r.errors }))
          );
        }
      })
    );
  }

  public clear(): void {
    this.getInputs().forEach(input => input.clear());
  }
}
