import { FormErrors } from '../../errors/FormErrors';
import { ValidationCallback } from '../ValidatableInput';
import { FieldViewModel } from './FieldViewModel';

export class SelectViewModel extends FieldViewModel {

    public options: SelectOption[];

    constructor(init: SelectViewModelInitializer) {
        super({
            required: init.required,
            placeholder: init.placeholder,
            name: init.name,
            icon: init.icon,
            value: init.value
        });
        this.options = init.options ?? [];
        this.type = 'select';
    }

    protected validateField(callback?: ValidationCallback): void {
        if (this.required && String.isNullOrWhiteSpace(this.value)) {
            callback?.(false, FormErrors.REQUIRED_FIELD);
        }
    }
}

export interface SelectOption {
    text: string;
    value: string;
}

export interface SelectViewModelInitializer {
    name: string;
    required: boolean;
    placeholder?: string;
    options?: SelectOption[];
    icon?: string;
    value?: string;
}
