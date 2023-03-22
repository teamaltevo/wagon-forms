import memoize from 'fast-memoize';
import { z } from 'zod';
import { FormErrors } from '../errors/FormErrors';
import { FieldViewModel } from './FieldViewModel';
import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';

export class SelectViewModel extends FieldViewModel<string | undefined> {

    public options: SelectOption[];

    constructor(init: SelectViewModelInitializer) {
        super({
            ...init,
            value: init.value,
            required: init.required,
        });

        this.options = init.options ?? [];
        this.type = 'select';
    }

    public clear(): void {
        this.value = undefined;
        super.clear();
    }

    public buildSchema(): ZodSchema {
        return memoize((required: boolean, options: Array<string|undefined>): ZodSchema => {
            let schema = required ?
                z.string({ required_error: FormErrors.REQUIRED_FIELD }) : z.string().optional();

            return schema.refine(
                value => required ? options.includes(value) : value === undefined || options.includes(value),
                { message: FormErrors.INVALID_OPTION }
            );
        })(this.required, this.options.map(o => o.value));
    }
}

export interface SelectOption {
    label: string;
    subLabel?: string;
    value: string;
}

export interface SelectViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
    name: string;
    required: boolean;
    options?: SelectOption[];
    value?: string;
}
