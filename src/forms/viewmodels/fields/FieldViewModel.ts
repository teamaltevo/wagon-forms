import { FieldViewModelInitializer, ZodSchema } from './FieldViewModelInitializer';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ValidatableInput } from '../ValidatableInput';
import { ValidationResult } from '../ValidationResult';

export abstract class FieldViewModel<T> implements ValidatableInput<T> {

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

	public get value(): T {
		return this.valueSubject.value;
	}

	public set value(value: T) {
		this.valueSubject.next(value);
	}

	public get value$(): Observable<T> {
		//TODO this can return a value that is not valid
		return this.valueSubject.asObservable();
	}

	public get validation$(): Observable<ValidationResult<T>> {
		return this.valueSubject.pipe(
			distinctUntilChanged(),
			map(value => {
				const result = this.buildSchema().safeParse(value);
				if (result.success) {
					return new ValidationResult(true, result.data);
				} else {
					return new ValidationResult(false, undefined, result.error.issues.map(i => i.message));
				}
			})
		)
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
	}

	public abstract clear(): void;
	public abstract buildSchema(): ZodSchema;

}
