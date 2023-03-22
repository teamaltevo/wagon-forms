import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { FormErrors } from '../errors/FormErrors';
import { z } from 'zod';
import memoize from 'fast-memoize';

export class TextFieldViewModel extends FieldViewModel<string> {

	public regex?: RegExp;
	public minLength: number;
	public maxLength: number;

	constructor(init: TextFieldViewModelInitializer) {
		super({
			...init,
			value: init.value ?? ''
		});

		this.regex = init.regex;
		this.minLength = init.minLength ?? 0;
		this.maxLength = init.maxLength ?? Number.MAX_VALUE;
		this.type = 'text';
	}

	public buildSchema(): ZodSchema {
		return memoize((required: boolean, minLength: number, maxLength: number, regex?: RegExp): ZodSchema => {
			let schema = z.string();
			if (required) {
				schema = schema.min(1, { message: FormErrors.REQUIRED_FIELD });
			}

			if (minLength > 0) {
				schema = schema.min(minLength, { message: FormErrors.MIN_LENGTH_REQUIRED });
			}

			if (maxLength) {
				if (maxLength < minLength) {
					throw new Error('maxLength must be greater than minLength');
				}

				schema = schema.max(maxLength, { message: FormErrors.MAX_LENGTH_OVERFLOW });
			}

			if (regex !== undefined) {
				schema = schema.regex(regex, { message: FormErrors.INVALID_FORMAT });
			}

			if (!required) {
				return schema.optional();
			}

			return schema;
		})(this.required, this.minLength, this.maxLength, this.regex);
	}

	public clear(): void {
		this.value = '';
        super.clear();
	}
}

export interface TextFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
	regex?: RegExp;
	minLength?: number;
	maxLength?: number;
	value?: string;
}
