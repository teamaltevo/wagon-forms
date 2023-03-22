import { z } from "zod";
import { FieldViewModel } from "./FieldViewModel";
import { FieldViewModelInitializer, ZodSchema } from "./FieldViewModelInitializer";
import { FormErrors } from '../errors/FormErrors';
import { map, Observable } from "rxjs";
import memoize from "fast-memoize";

export class DateFieldViewModel extends FieldViewModel<Date | undefined> {

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
        super.clear();
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
        return memoize((required: boolean, minDate?: Date, maxDate?: Date) => {
            let schema = z.date({
                required_error: FormErrors.REQUIRED_FIELD,
                invalid_type_error: FormErrors.INVALID_FORMAT
            });

            if (minDate) {
                schema = schema.min(minDate, { message: FormErrors.MIN_DATE_OVERFLOW });
            }

            if (maxDate) {
                schema = schema.max(maxDate, { message: FormErrors.MAX_DATE_OVERFLOW });
            }

            if (!required) {
                return schema.optional();
            }

            return schema;
        })(this.required, this.minDate, this.maxDate);
    }
}

export interface DateFieldViewModelInitializer extends Omit<FieldViewModelInitializer<string>, "value"> {
    value?: Date;
    minDate?: Date;
    maxDate?: Date;
}
