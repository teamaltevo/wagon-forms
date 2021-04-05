import { Observable } from 'rxjs';

export type ValidationCallback = (result: boolean, error?: string) => void;

export interface ValidatableInput {
    value: any;
    name: string;
    hasError: boolean;
    isValid: boolean;
    validation$: Observable<boolean>;
    validate(callback?: ValidationCallback): void; 
    clear(): void;
}