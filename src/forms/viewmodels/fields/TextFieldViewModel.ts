import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { FormErrors } from '../../errors/FormErrors';
import { z } from 'zod';

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

	//TODO how to memoize this?
	public buildSchema(): ZodSchema {
		let schema = z.string();
		if (this.required) {
			schema = schema.min(1, { message: FormErrors.REQUIRED_FIELD });
		}
	
		if (this.minLength > 0) {
			schema = schema.min(this.minLength, { message: FormErrors.MIN_LENGTH_REQUIRED });
		}
	
		if (this.maxLength) {
			if (this.maxLength < this.minLength) {
				throw new Error('maxLength must be greater than minLength');
			}
	
			schema = schema.max(this.maxLength, { message: FormErrors.MAX_LENGTH_OVERFLOW });
		}
	
		if (this.regex !== undefined) {
			schema = schema.regex(this.regex, { message: FormErrors.INVALID_FORMAT });
		}
	
		if (!this.required) {
			return schema.optional();
		}
	
		return schema;
	}

	public clear(): void {
		this.value = '';
	}
}

export interface TextFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
	regex?: RegExp;
	minLength?: number;
	maxLength?: number;
	validationShema?: ZodSchema;
	value?: string;
}
