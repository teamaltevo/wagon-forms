import memoize from 'fast-memoize';
import { z } from 'zod';
import validator from "validator";
import { FormErrors } from '../errors/FormErrors';
import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';

type PhoneLocale = validator.MobilePhoneLocale | validator.MobilePhoneLocale[];

export class PhoneFieldViewModel extends FieldViewModel<string> {

	locale: PhoneLocale;

	constructor(init: PhoneFieldViewModelInitializer) {
		super({
			...init,
			value: init.value ?? ''
		});

		this.type = 'tel';
		this.locale = init.locale;
	}

	public buildSchema(): ZodSchema {
		return memoize((required: boolean, locale: PhoneLocale): ZodSchema => {
			let schema = z.string();
			if (required) {
				return schema.min(1, {
					message: FormErrors.REQUIRED_FIELD
				}).refine(v => validator.isMobilePhone(v, locale), {
					message: FormErrors.INVALID_PHONE_NUMBER
				})
			} else {
				return schema.optional();
			}
		})(this.required, this.locale);
	}

	public clear(): void {
		this.value = '';
        super.clear();
	}
}

export interface PhoneFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
	value?: string;
	locale: PhoneLocale;
}