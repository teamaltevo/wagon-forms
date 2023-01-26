import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BaseViewModel } from '../interfaces/BaseViewModel';
import { ValidationResult } from '../interfaces/ValidationResult';

export abstract class FieldViewModel<T> implements BaseViewModel<T> {

	private valueSubject: BehaviorSubject<T>;

	public name: string;
	public required: boolean;
	public type?: string;
	public placeholder?: string;
	public label?: string;
	public hint?: string;
	public readonly: boolean;
	public disabled: boolean;
	public icon?: string;
	public hasExplicitValidation = false;

	private schemaFactory: () => ZodSchema;

	public get value(): T {
		return this.valueSubject.value;
	}

	public set value(value: T) {
		if (this.readonly) return;
		this.valueSubject.next(value);
	}

	public get value$(): Observable<T> {
		return this.valueSubject.asObservable();
	}

	public get validation$(): Observable<ValidationResult<T>> {
		return this.valueSubject.pipe(
			distinctUntilChanged(),
			map(value => {
				const result = this.schemaFactory().safeParse(value);
				if (result.success) {
					return new ValidationResult(this.name, true, result.data);
				} else {
					return new ValidationResult(this.name, false, undefined, result.error.issues.map(i => i.message));
				}
			})
		)
	}

	public onFormValidation(): void {
		this.hasExplicitValidation = true;
	}

	public get isValid$(): Observable<boolean> {
		return this.validation$.pipe(map(r => r.result));
	}

	public get errors$(): Observable<string[] | undefined> {
		return this.validation$.pipe(map(r => r.errors ?? undefined));
	}

	constructor(init: FieldViewModelInitializer<T>) {
		this.valueSubject = new BehaviorSubject(init.value);
		this.name = init.name;
		this.required = init.required;
		this.icon = init.icon;
		this.placeholder = init.placeholder;
		this.hint = init.hint;
		this.label = init.label;
		this.readonly = init.readonly ?? false;
		this.disabled = init.disabled ?? false;
		this.schemaFactory = init.validationShema !== undefined ? 
			() => init.validationShema! : this.buildSchema.bind(this);
	}

	public abstract clear(): void;
	public abstract buildSchema(): ZodSchema;

}
