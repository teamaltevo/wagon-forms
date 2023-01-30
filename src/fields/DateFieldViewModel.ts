import { z } from "zod";
import { FieldViewModel } from "./FieldViewModel";
import { FieldViewModelInitializer } from "./FieldViewModelInitializer";
import { ZodSchema } from '../../dist/fields/FieldViewModelInitializer';
import { FormErrors } from '../errors/FormErrors';
import { map, Observable } from "rxjs";

export class DateFieldViewModel extends FieldViewModel<Date|undefined> {

    minDate?: Date;
    maxDate?: Date;

    constructor(init: DateFieldViewModelInitializer) {
        super({
            ...init,
            value: init.value,
        });
        
        this.minDate = init.minDate;
        this.maxDate = init.maxDate;
        this.type = 'date';
    }

    public clear(): void {
        this.value = undefined;
    }

    public get isoValue(): string | undefined {
        return this.value?.toISOString() ?? undefined;
    }

    public get isoValue$(): Observable<string | undefined> {
        return this.value$.pipe(
            map(value => value?.toISOString() ?? undefined)
        );
    }

    public buildSchema(): ZodSchema {

        let schema = z.date({
            required_error: FormErrors.REQUIRED_FIELD,
            invalid_type_error: FormErrors.INVALID_FORMAT
        });

        if (this.minDate) {
            schema = schema.min(this.minDate, { message: FormErrors.MIN_DATE_OVERFLOW });
        }

        if (this.maxDate) {
            schema = schema.max(this.maxDate, { message: FormErrors.MAX_DATE_OVERFLOW });
        }

        if (!this.required) {
            return schema.optional();
        }

        return schema;
    }
}

export interface DateFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
	value?: Date;
    minDate?: Date;
    maxDate?: Date;
}
