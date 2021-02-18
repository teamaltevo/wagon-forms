import { Observable } from 'rxjs';

export type ValidationCallback = (result: boolean, error?: string) => void;

export interface ValidatableInput {
    value: any;
    name: string;
    hasError: boolean;
    isValid: boolean;
    validationStream: Observable<boolean>;
    validate(callback?: ValidationCallback): void; 
}