export class FormValidationError extends Error{
  constructor(
    public message: string,
    public cause?: any
  ) { 
    super(message);
  }
}