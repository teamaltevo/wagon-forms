import { FieldViewModel } from './fields/FieldViewModel';
import { Observable, merge, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ValidatableInput } from './ValidatableInput';

export abstract class FormViewModel {

	private completionSubject?: Subject<boolean>;

	public abstract getInputs(): ValidatableInput[];

	public get completionStream(): Observable<boolean> {
		if (!this.completionSubject) {
			this.completionSubject = new Subject();
			this.watchFieldsChange();
		}
		return this.completionSubject.pipe(distinctUntilChanged());
	}

	public get isComplete(): boolean {
		return this.getInputs().every(field => field.isValid);
	}

	public validateForm(onFormValidated: (formData: any) => void): void {
		let isValid = true;
		const formData: any = {};
		this.getInputs().forEach(field => {
			formData[field.name] = field.value;
			field.validate((result) => {
				if (!result) {
					isValid = false;
				}
			});
		});

		if (isValid) {
			onFormValidated(formData);
		}
	}

	private watchFieldsChange(): void {
		const fieldStreams = this.getInputs().map(field => field.validationStream);
		merge(...fieldStreams).subscribe(this.onFieldValueChange.bind(this));
	}

	private onFieldValueChange(): void {
		this.completionSubject?.next(this.isComplete);
	}
}
