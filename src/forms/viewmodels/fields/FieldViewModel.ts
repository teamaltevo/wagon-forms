import { CustomValidator, FieldViewModelInitializer } from './FieldViewModelInitializer';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ValidationCallback, ValidatableInput } from '../ValidatableInput';

export abstract class FieldViewModel implements ValidatableInput {

	private valueSubject: BehaviorSubject<string>;
	private validationSubject: BehaviorSubject<boolean>;

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
		return this.valueSubject.value;
	}

	public set value(value: string) {
		this.valueSubject.next(value);
		this.validateWithPreferredValidator(result => {
			if (result) { this.clearError(); }
			this.validationSubject.next(result);
		});
	}

	public get valueStream(): Observable<string> {
		return this.valueSubject.asObservable();
	}

	public get validationStream(): Observable<boolean> {
		return this.validationSubject.asObservable().pipe(distinctUntilChanged());
	}

	public get hasError(): boolean {
		return !String.isNullOrEmpty(this.error);
	}

	public get isValid(): boolean {
		return this.validationSubject.value;
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
		this.validationSubject = this.initializeValidationSubject();
	}

	protected abstract validateField(callback?: ValidationCallback): void;

	public validate(callback?: ValidationCallback): void {
		this.clearError();
		this.validateWithPreferredValidator((result: boolean, error?: string) => {
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

	private initializeValidationSubject(): BehaviorSubject<boolean> {
		let subject = new BehaviorSubject<boolean>(false);
		this.validateWithPreferredValidator((result: boolean) => {
			subject.next(result);
		});
		return subject;
	}

	private validateWithPreferredValidator(callback?: ValidationCallback): void {
		if (this.customValidator) {
			const validation = this.customValidator(this.value);
			callback?.(validation.result, validation.error);
		} else {
			this.validateField(callback);
		}
	}
}
