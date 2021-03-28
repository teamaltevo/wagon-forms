import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { ValidatableInput, ValidationCallback } from "../ValidatableInput";
import { CheckboxViewModelInitializer } from "./CheckboxViewModelInitializer";

export class CheckboxViewModel implements ValidatableInput {
    private required: boolean;
    private initialValue: boolean;
    public name: string;
    public label: string;
    public error?: string;

    private valueSubject: BehaviorSubject<boolean>;
    private validationSubject: BehaviorSubject<boolean>;

    public value$: Observable<boolean>;
    public validationStream: Observable<boolean>;
    public enabled$: Observable<boolean>;

    public get value(): boolean {
        return this.valueSubject.value;
    }

    public set value(value: boolean) {
        this.valueSubject.next(value);
        this.validate(result => {
            if (result) { this.clearError(); }
            this.validationSubject.next(result);
        });
    }

    public get hasError(): boolean {
        return !String.isNullOrEmpty(this.error);
    }

    public get isValid(): boolean {
        return this.validationSubject.value;
    }

    constructor(init: CheckboxViewModelInitializer) {
        this.initialValue = init.value ?? false;
        this.valueSubject = new BehaviorSubject(this.initialValue);
        this.validationSubject = this.initializeValidationSubject();
        this.name = init.name;
        this.required = init.required;
        this.label = init.label;

        this.enabled$ = new BehaviorSubject(true).asObservable();
        this.validationStream = this.validationSubject.asObservable().pipe(distinctUntilChanged());
        this.value$ = this.valueSubject.asObservable();
    }

    public validate(callback?: ValidationCallback): void {
        this.clearError();
        const result = !this.required || this.value;
        if (!result) {
            this.error = 'forms.errors.requiredField';
        }
        callback?.(result, !result ? this.error : undefined);
    }

    public bindEnabled(observable: Observable<boolean>): void {
        this.enabled$ = observable;
    }

    public clear(): void {
        this.value = this.initialValue;
    }

    public clearError(): void {
        this.error = undefined;
    }

    private initializeValidationSubject(): BehaviorSubject<boolean> {
        const subject = new BehaviorSubject<boolean>(false);
        this.validate((result: boolean) => {
            subject.next(result);
        });
        return subject;
    }
}