import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationCallback } from '../ValidatableInput';
import { FieldViewModel } from './FieldViewModel';
import { FormErrors } from '../../errors/FormErrors';

export class NumericFieldViewModel extends FieldViewModel {

    public minValue: number;
    public maxValue: number;
    public integer: boolean;

    public get numericValue(): number {
        return parseFloat(this.value ?? 0);
    }

    public get numericValue$(): Observable<number> {
        return this.value$.pipe(map(v => parseFloat(v)))
    }

    constructor(init: NumericFieldViewModelInitializer) {
        super({
            required: init.required,
            name: init.name,
            placeholder: init.placeholder,
            icon: init.icon,
            value: init.value?.toString(),
        });

        this.integer = init.integer ?? false;
        this.minValue = init.minValue ?? -Number.MAX_VALUE;
        this.maxValue = init.maxValue ?? Number.MAX_VALUE;
        this.type = 'number';
    }

    protected validateField(callback?: ValidationCallback): void {
        if (!this.required && String.isNullOrEmpty(this.value)) {
            callback?.(true);
        } else if (this.required && String.isNullOrWhiteSpace(this.value)) {
            callback?.(false, FormErrors.REQUIRED_FIELD);
        } else if (isNaN(this.numericValue)) {
            callback?.(false, FormErrors.NOT_A_NUMBER);
        } else if (this.integer && !Number.isInteger(this.numericValue)) {
            callback?.(false, FormErrors.NOT_AN_INTEGER);
        } else if (this.numericValue < this.minValue) {
            callback?.(false, FormErrors.MIN_VALUE_OVERFLOW);
        } else if (this.numericValue > this.maxValue) {
            callback?.(false, FormErrors.MAX_VALUE_OVERFLOW);
        } else {
            callback?.(true);
        }
    }
}

export interface NumericFieldViewModelInitializer {
    name: string;
    required: boolean;
    placeholder?: string;
    icon?: string;
    value?: number;
    integer?: boolean;
    minValue?: number;
    maxValue?: number;
}

