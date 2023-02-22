import memoize from 'fast-memoize';
import { z } from 'zod';
import { FormErrors } from '../errors/FormErrors';
import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';

export class EmailFieldViewModel extends FieldViewModel<string> {

	constructor(init: EmailFieldViewModelInitializer) {
		super({
			...init,
			value: init.value ?? ''
		});
		this.type = 'email';
	}
	public buildSchema(): ZodSchema {
		return memoize((required: boolean): ZodSchema => {
			let schema = z.string().email({ message: FormErrors.INVALID_EMAIL_ADDRESS });
			if (required) {
				schema = schema.min(1, { message: FormErrors.REQUIRED_FIELD });
			} else {
				return schema.optional();
			}
			return schema
		})(this.required);
	}

	public clear(): void {
		this.value = '';
	}
}

export interface EmailFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
	value?: string;
}