import { FieldViewModel, ValidationCallback } from './FieldViewModel';
import { FieldViewModelInitializer } from './FieldViewModelInitializer';
import { FormErrors } from '../../errors/FormErrors';

export class TextFieldViewModel extends FieldViewModel {

	constructor(init: FieldViewModelInitializer) {
		super(init);
		this.type = 'text';
	}

	protected validateField(callback?: ValidationCallback): void {
		if (this.required && String.isNullOrWhiteSpace(this.value)) {
			callback?.(false, FormErrors.REQUIRED_FIELD);
		} else if (this.value.length < this.minLength) {
			callback?.(false, FormErrors.MIN_LENGTH_REQUIRED);
		} else if (this.value.length > this.maxLength) {
			callback?.(false, FormErrors.MAX_LENGTH_OVERFLOW);
		} else {
			callback?.(true);
		}
	}
}
