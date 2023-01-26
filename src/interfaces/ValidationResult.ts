export class ValidationResult<T> {
  constructor(
    public field: string,
    public result: boolean,
    public value?: T,
    public errors?: string[]
  ) { }
}

