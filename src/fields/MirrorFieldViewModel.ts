import { FieldViewModel } from "./FieldViewModel";
import { FormErrors } from '../errors/FormErrors';
import { z } from "zod";
import { ZodSchema } from './FieldViewModelInitializer';
import memoize from "fast-memoize";

export class MirrorFieldViewModel extends FieldViewModel<string> {

	private mirroredField: FieldViewModel<string>;

	constructor(init: MirrorFieldInitializer) {
		super({
			...init,
			required: true,
			value: ''
		});

		this.mirroredField = init.mirrors;
		this.type = init.mirrors.type;
	}

	public buildSchema(): ZodSchema {
		return memoize((mirrorValue: string): ZodSchema => {
			return z.string().min(1, {
				message: FormErrors.REQUIRED_FIELD
			}).refine((value: string) => {
				return value === mirrorValue;
			}, {
				message: FormErrors.FIELDS_DOESNT_MATCH
			});
		})(this.mirroredField?.value);
	}

	public clear(): void {
		this.value = '';
        super.clear();
	}
}

export interface MirrorFieldInitializer {
	name: string;
	mirrors: FieldViewModel<string>;
	icon?: string;
	placeholder?: string;
	label?: string;
	hint?: string;
	readonly?: boolean;
	disabled?: boolean;
}