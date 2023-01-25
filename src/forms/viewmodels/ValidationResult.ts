export class ValidationResult<T> {
	constructor(public result: boolean, public value?: T, public errors?: string[]){}
}

