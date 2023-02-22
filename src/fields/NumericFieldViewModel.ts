import { FieldViewModel } from './FieldViewModel';
import { FormErrors } from '../errors/FormErrors';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { z } from 'zod';
import memoize from 'fast-memoize';

export class NumericFieldViewModel extends FieldViewModel<number | undefined> {

    public minValue: number;
    public maxValue: number;
    public integer: boolean;

    constructor(init: NumericFieldViewModelInitializer) {
        super({
            ...init,
            value: init.value ?? undefined,
        });

        this.integer = init.integer ?? false;
        this.minValue = init.minValue ?? -Number.MAX_VALUE;
        this.maxValue = init.maxValue ?? Number.MAX_VALUE;
        this.type = 'number';
    }

    public clear(): void {
        this.value = undefined;
    }

    public buildSchema(): ZodSchema {
        return memoize((required: boolean, min: number, max: number, integer: boolean): ZodSchema => {
            let schema = z.number({required_error: FormErrors.REQUIRED_FIELD})
            .min(min, { message: FormErrors.MIN_VALUE_OVERFLOW })
            .max(max, { message: FormErrors.MAX_VALUE_OVERFLOW })

            if (integer) {
                schema = schema.int({ message: FormErrors.NOT_AN_INTEGER });
            }

            if (!required) {
                return schema.optional();
            }

            return schema;

        })(this.required, this.minValue, this.maxValue, this.integer);
    }
}

export interface NumericFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
    value?: number;
    integer?: boolean;
    minValue?: number;
    maxValue?: number;
}

