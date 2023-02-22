import { FormErrors } from '../errors/FormErrors';

/**
 * A function that takes a form error and returns a string message for display
 */
export type ErrorMessageFactory = (error: FormErrors) => string;

export const ErrorMessageFactoryBuilder = (record: Record<string, string>): ErrorMessageFactory => {
    return (error: FormErrors) => record[error] ?? error;
}