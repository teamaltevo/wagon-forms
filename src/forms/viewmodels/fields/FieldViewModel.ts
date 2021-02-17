import { CustomValidator, FieldViewModelInitializer } from './FieldViewModelInitializer';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export type ValidationCallback = (result: boolean, error?: string) => void;
export abstract class FieldViewModel {

	private valueSubject: BehaviorSubject<string>;
	private validationSubject: Subject<boolean>;

	public name: string;
	public required: boolean;
	public type?: string;
	public placeholder: string;
	public error?: string;
	public icon?: string;
	public minLength: number;
	public maxLength: number;
	public customValidator?: CustomValidator;

	public get value(): string {
		return this.valueSubject.getValue();
	}

	public set value(value: string) {
		this.valueSubject.next(value);
		this.validateWithPreferedValidator(result => {
			if (result) { this.clearError(); }
			this.validationSubject.next(result);
		});
	}

	public get valueStream(): Observable<string> {
		return this.valueSubject.asObservable();
	}

	public get validationStream(): Observable<boolean> {
		return this.validationSubject.asObservable();
	}

	constructor(init: FieldViewModelInitializer) {
		this.name = init.name;
		this.required = init.required;
		this.icon = init.icon;
		this.valueSubject = new BehaviorSubject(init.value ?? '');
		this.placeholder = init.placeholder ?? '';
		this.minLength = init.minLength ?? 0;
		this.maxLength = init.maxLength ?? Number.MAX_VALUE;
		this.customValidator = init.customValidator;
		this.validationSubject = new Subject<boolean>();
	}

	protected abstract validateField(callback?: ValidationCallback): void;

	public validate(callback?: ValidationCallback): void {
		this.clearError();
		this.validateWithPreferedValidator((result: boolean, error?: string) => {
			if (!result) {
				this.error = error;
			}
			callback?.(result, error);
		});
	}

	public clear(): void {
		this.value = '';
	}

	public clearError(): void {
		this.error = undefined;
	}

	public get hasError(): boolean {
		return String.isNullOrEmpty(this.error);
	}

	public get isValid(): boolean {
		let validated = true;
		this.validateWithPreferedValidator((result: boolean) => {
			validated = result;
		});
		return validated;
	}

	private validateWithPreferedValidator(callback?: ValidationCallback): void {
		if (this.customValidator) {
			const validation = this.customValidator(this.value);
			callback?.(validation.result, validation.error);
		} else {
			this.validateField(callback);
		}
	}
}
