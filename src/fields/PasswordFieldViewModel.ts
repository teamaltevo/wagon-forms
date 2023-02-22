import { TextFieldViewModel, TextFieldViewModelInitializer } from './TextFieldViewModel';

export class PasswordFieldViewModel extends TextFieldViewModel {

	constructor(init: TextFieldViewModelInitializer) {
		super(init);
		this.type = 'password';
	}
}

