import { Observable, combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FormValidationError } from '../errors/FormValidationError';
import { BaseViewModel } from '../interfaces/BaseViewModel';
import { ValidationResult } from '../interfaces/ValidationResult';

export type FormDataObject = { [key: string]: any };

export abstract class FormViewModel<T extends FormDataObject> {

  public abstract getInputs(): BaseViewModel<unknown>[];

  private get validation$(): Observable<ValidationResult<unknown>[]> {
    return combineLatest(this.getInputs().map(input => input.validation$));
  }

  public get isValid$(): Observable<boolean> {
    return this.validation$.pipe(
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

  public setReadonly(readOnly: boolean): void {
    this.getInputs().forEach(input => input.readonly = readOnly);
  }
  
  public setDisabled(disabled: boolean): void {
    this.getInputs().forEach(input => input.disabled = disabled);
  }

  /**
   * Set one or more values to the form inputs.
   * Note: undefined values will be ignored by this method.
   * @param values Partial object with the values to set.
   */
  public setValues(values: Partial<T>): void {
    this.getInputs().forEach(input => {
      if (values[input.name] !== undefined) {
        input.value = values[input.name];
      }
    });
  }

  /**
   * Replace the value of the form inputs with the values of the model.
   * Undefined values will clear the associated input.
   * @param model
   */
  public setModel(model: T): void {
    this.getInputs().forEach(input => {
        input.value = model[input.name];
    });
  }
}
