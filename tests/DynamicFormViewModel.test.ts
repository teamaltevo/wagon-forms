import 'jest-extended';
import { TextFieldViewModel } from '../src/fields/TextFieldViewModel';
import { FormViewModel } from '../src/forms/FormViewModel';
import { BaseViewModel } from '../src/interfaces/BaseViewModel';
import { EmailFieldViewModel } from '../src/fields/EmailFieldViewModel';
import { NumericFieldViewModel } from '../src/fields/NumericFieldViewModel';
import { DynamicFormViewModel } from '../src/forms/DynamicFormViewModel';

interface TestFormModel {
    text: string;
    email: string;
    number: number;
}

describe('DynamicFormViewModel Tests', () => {
    
    let viewModel: DynamicFormViewModel<TestFormModel>;
    beforeEach(() => {
        viewModel = new DynamicFormViewModel()
    })

    it('it should be possible to add fields on the fly', () => {
        viewModel.add(new TextFieldViewModel({
            name: 'text',
            required: true,
        }))

        viewModel.add(new EmailFieldViewModel({
            name: 'email',
            required: true
        }))

        viewModel.add(new NumericFieldViewModel({
            name: 'number',
            integer: true,
            required: true
        }))

        expect(viewModel.getInputs().length).toBe(3);
        expect(viewModel.getInputs()[0]).toBeInstanceOf(TextFieldViewModel);  
        expect(viewModel.getInputs()[1]).toBeInstanceOf(EmailFieldViewModel);  
        expect(viewModel.getInputs()[2]).toBeInstanceOf(NumericFieldViewModel);  
    })

    it('new fields should be included in form validation', done => {
        viewModel.add(new TextFieldViewModel({
            name: 'text',
            required: true,
            value: 'Olivier'
        }))

        viewModel.add(new EmailFieldViewModel({
            name: 'email',
            required: true,
            value: 'test@test.ca'
        }))

        viewModel.add(new NumericFieldViewModel({
            name: 'number',
            integer: true,
            required: true,
            value: 1
        }))
    
        viewModel.validateForm().subscribe(result => {
            expect(result).toEqual({
                text: 'Olivier',
                email: 'test@test.ca',
                number: 1
            })
            done()
        })
    })

})