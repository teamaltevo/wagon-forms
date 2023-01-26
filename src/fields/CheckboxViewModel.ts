import memoize from 'fast-memoize';
import { z } from 'zod';
import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { FormErrors } from '../errors/FormErrors';

export class CheckboxViewModel extends FieldViewModel<boolean> {

    constructor(init: CheckboxViewModelInitializer) {
        super({
            ...init,
            value: init.value ?? false
        });

        this.type = 'checkbox';
    }

    public clear(): void {
        this.value = false;
    }

    public buildSchema(): ZodSchema {
        return memoize((required: boolean): ZodSchema => {
            return z.boolean().refine(
                value => required ? value : true,
                { message: FormErrors.REQUIRED_FIELD }
            );
        })(this.required);
    }
}

export interface CheckboxViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value" | "placeholder"> {
    value?: boolean;
}