import { FieldViewModel } from './fields/FieldViewModel';
import { Observable, merge, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export abstract class FormViewModel {

	private completionSubject?: Subject<boolean>;

	public abstract getFields(): FieldViewModel[];

	public get completionStream(): Observable<boolean> {
		if (!this.completionSubject) {
			this.completionSubject = new Subject();
			this.watchFieldsChange();
		}
		return this.completionSubject.pipe(distinctUntilChanged());
	}

	public get isComplete(): boolean {
		return this.getFields().every(field => field.isValid);
	}

	private watchFieldsChange(): void {
		const fieldStreams = this.getFields().map(field => field.validationStream);
		merge(...fieldStreams).subscribe(this.onFieldValueChange.bind(this));
	}

	private onFieldValueChange(): void {
		this.completionSubject?.next(this.isComplete);
	}

	public validateForm(onFormValidated: (formData: any) => void): void {
		let isValid = true;
		const formData: any = {};
		this.getFields().forEach(field => {
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
}
