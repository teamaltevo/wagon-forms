import { ValidationResult } from '../ValidationResult';
export type CustomValidator = (value: string) => ValidationResult;
export interface FieldViewModelInitializer {
	name: string;
	required: boolean;
	placeholder?: string;
	icon?: string;
	value?: string;
	minLength?: number;
	maxLength?: number;
	customValidator?: CustomValidator;
}
