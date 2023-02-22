import memoize from "fast-memoize";
import { z } from "zod";
import { FieldViewModel } from "./FieldViewModel";
import { FieldViewModelInitializer, ZodSchema } from "./FieldViewModelInitializer";
import { FormErrors } from '../errors/FormErrors';

export class FileInputViewModel extends FieldViewModel<File | undefined> {

    allowedExtensions: string[];
    maxSizeKb: number;

    constructor(init: FileInputViewModelInitializer) {
        super({
            ...init,
            value: init.value,
        });

        this.type = 'file';
        this.allowedExtensions = init.allowedExtensions;
        this.maxSizeKb = init.maxSizeKb ?? Number.MAX_SAFE_INTEGER;
    }

    public buildSchema(): ZodSchema {
        return memoize((required: boolean, maxSize: number, extensions: string[]): ZodSchema => {
            let schema = z.instanceof(File, FormErrors.REQUIRED_FIELD)
                .refine((file: File) => file.size <= maxSize * 1024, FormErrors.FILE_SIZE_TOO_LARGE)
                .refine((file: File) => extensions.includes(file.name.split('.').pop() ?? ''), FormErrors.FILE_EXTENSION_NOT_ALLOWED);
            if (required) {
                return schema
            } else {
                return schema.optional();
            }
        })(this.required, this.maxSizeKb, this.allowedExtensions);
    }

    public clear(): void {
        this.value = undefined;
    }
}

export interface FileInputViewModelInitializer extends Omit<FieldViewModelInitializer<File | undefined>, "value"> {
    value?: File;
    maxSizeKb?: number;
    allowedExtensions: string[];
}