import { Observable } from 'rxjs';

export type ValidationCallback = (result: boolean, error?: string) => void;

export interface ValidatableInput<T> {
    value: T;
    value$: Observable<T>
    isValid$: Observable<boolean>;
    errors$: Observable<string[] | undefined>;
    clear(): void;
}