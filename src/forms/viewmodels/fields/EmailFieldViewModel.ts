import { FormErrors } from '../../errors/FormErrors';
import { FieldViewModel, ValidationCallback } from './FieldViewModel';
import { FieldViewModelInitializer } from './FieldViewModelInitializer';

export class EmailFieldViewModel extends FieldViewModel {

	constructor(init: FieldViewModelInitializer) {
		super(init);
		this.type = 'email';
	}

	protected validateField(callback?: ValidationCallback): void {
		if (this.required && String.isNullOrWhiteSpace(this.value)) {
			callback?.(false, FormErrors.REQUIRED_FIELD);
		} else if (!this.emailIsValid()) {
			callback?.(false, FormErrors.INVALID_EMAIL_ADDRESS);
		} else {
			callback?.(true);
		}
	}

	private emailIsValid(): boolean {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(this.value);
	}
}
