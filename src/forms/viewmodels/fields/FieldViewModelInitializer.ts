import { ZodFirstPartySchemaTypes } from 'zod';

export type ZodSchema = ZodFirstPartySchemaTypes;
export interface FieldViewModelInitializer<T> {
	name: string;
	required: boolean;
	placeholder?: string;
	label?: string;
	hint?: string;
	icon?: string;
	value: T;
	readonly?: boolean;
	disabled?: boolean;
	validationShema?: ZodSchema;
}
