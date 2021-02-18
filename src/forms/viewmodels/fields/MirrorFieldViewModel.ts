import { ValidationCallback } from "../ValidatableInput";
import { FieldViewModel } from "./FieldViewModel";
import { FormErrors } from '../../errors/FormErrors';

export class MirrorFieldViewModel extends FieldViewModel {

	private mirroredField?: FieldViewModel;
	private customError?: string;

	constructor(init: MirrorFieldInitializer) {
		super({
			required: true,
			name: init.name,
			placeholder: init.placeholder,
			icon: init.icon ?? init.mirroredField.icon
		});
		this.mirroredField = init.mirroredField;
        this.customError = init.noMatchCustomError;
		this.type = init.mirroredField.type;
	}

	protected validateField(callback?: ValidationCallback): void {
		if (this.value !== this.mirroredField?.value) {
			callback?.(false, this.customError ?? FormErrors.FIELDS_DOESNT_MATCH);
		}
		else if (String.isNullOrEmpty(this.value)) {
			callback?.(false, FormErrors.REQUIRED_FIELD);
		}
		else {
			callback?.(true);
		}
	}
}

export interface MirrorFieldInitializer {
	name: string;
	mirroredField: FieldViewModel;
	icon?: string;
	placeholder?: string;
    noMatchCustomError?: string;
}