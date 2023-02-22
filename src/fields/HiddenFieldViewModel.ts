import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";
import { BaseViewModel } from "../interfaces/BaseViewModel";
import { ValidationResult } from "../interfaces/ValidationResult";
import { FormErrors } from '../errors/FormErrors';

type Optional<T> = T | undefined;

export class HiddenFieldViewModel<T> implements BaseViewModel<Optional<T>> {
    
    private valueSubject: BehaviorSubject<Optional<T>>;
    public name: string;
    public required: boolean;
    public type = 'hidden';
    
    constructor(init: HiddenFieldViewModelInitializer<T>) {
        this.valueSubject = new BehaviorSubject(init.value);
        this.name = init.name;
        this.required = init.required ?? true;
    }

    public get value(): Optional<T> {
		return this.valueSubject.value;
	}

	public set value(value: Optional<T>) {
		this.valueSubject.next(value);
	}

	public get value$(): Observable<Optional<T>> {
		return this.valueSubject.asObservable();
	}

	public get validation$(): Observable<ValidationResult<Optional<T>>> {
		return this.valueSubject.pipe(
			distinctUntilChanged(),
			map(value => {
				const valid = !this.required || value !== undefined;
				if (valid) {
					return new ValidationResult(this.name, true, value);
				} else {
					return new ValidationResult(this.name, false, undefined, [FormErrors.REQUIRED_FIELD]);
				}
			})
		)
	}

    public get errors$(): Observable<string[] | undefined> {
		return this.validation$.pipe(map(r => r.errors ?? undefined));
	}

    onFormValidation(): void {
        // No-op
    }

    clear(): void {
        // Clear is not implemented for hidden fields as they are not meant to be
        // rendered on the page
    }

    get disabled(): boolean {
        return false;
    }

    set disabled(value: boolean) {
        // No-op
    }

    get readonly(): boolean {
        return false;
    }

    set readonly(value: boolean) {
        // No-op
    }
}

export interface HiddenFieldViewModelInitializer<T> {
    name: string;
    required: boolean;
    value?: T;
}