import { FieldViewModelInitializer } from './FieldViewModelInitializer';
import { TextFieldViewModel } from './TextFieldViewModel';

export class PasswordFieldViewModel extends TextFieldViewModel {

	constructor(init: FieldViewModelInitializer) {
		super(init);
		this.type = 'password';
	}
}
