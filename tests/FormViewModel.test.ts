import 'jest-extended';
import { skip } from 'rxjs/operators';
import { TextFieldViewModel } from '../src/fields/TextFieldViewModel';
import { FormViewModel } from '../src/forms/FormViewModel';
import { BaseViewModel } from '../src/interfaces/BaseViewModel';
import { EmailFieldViewModel } from '../src/fields/EmailFieldViewModel';
import { NumericFieldViewModel } from '../src/fields/NumericFieldViewModel';
import { HiddenFieldViewModel } from '../src/fields/HiddenFieldViewModel';

interface TestFormModel {
    text: string;
    email: string;
    number: number;
}

class TestFormViewModel extends FormViewModel<TestFormModel> {

    textViewModel = new TextFieldViewModel({
        name: 'text',
        required: true,
    })

    emailViewModel = new EmailFieldViewModel({
        name: 'email',
        required: true
    })

    numberViewModel = new NumericFieldViewModel({
        name: 'number',
        integer: true,
        required: true
    })

    secretViewModel = new HiddenFieldViewModel({
        name: 'secret',
        value: 'my-secret-api-key',
        required: true
    })


    public getInputs(): BaseViewModel<unknown>[] {
        return [
            this.textViewModel,
            this.emailViewModel,
            this.numberViewModel,
            this.secretViewModel
        ]
    }
}

describe('FormViewModel Tests', () => {
    
    let viewModel: TestFormViewModel;
    beforeEach(() => {
        viewModel = new TestFormViewModel()
    })

    it('should not be valid if one ore more field is not valid', done => {
        viewModel.textViewModel.value = 'Olivier'
        viewModel.emailViewModel.value = 'not an email'
        viewModel.numberViewModel.value = undefined
        viewModel.isValid$.subscribe(isValid => {
            expect(isValid).toBeFalse()
            done()
        })
    })

    it('should throw an error if one ore more field is not valid when using validateForm', done => {
        viewModel.textViewModel.value = 'Olivier'
        viewModel.emailViewModel.value = 'not an email'
        viewModel.numberViewModel.value = undefined
        viewModel.validateForm().subscribe({
            next: () => {
                fail('Should not be called')
            },
            error: err => {
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toEqual('One or more fields of this form are invalid, check error.cause for details.')
                done()
            }
        })
    })

    it('should be valid if all fields are valid', done => {
        viewModel.textViewModel.value = 'Tommy'
        viewModel.emailViewModel.value = 'tommy@mail.com'
        viewModel.numberViewModel.value = 42
        viewModel.isValid$.subscribe(isValid => {
            expect(isValid).toBeTrue()
            done()
        })
    })

    it('should return the form data when validated', done => {
        viewModel.textViewModel.value = 'Tommy'
        viewModel.emailViewModel.value = 'test@test.ca'
        viewModel.numberViewModel.value = 42
        viewModel.validateForm().subscribe(data => {
            expect(data).toEqual({
                text: 'Tommy',
                email: 'test@test.ca',
                number: 42,
                secret: 'my-secret-api-key'
            })
            done()
        })
    })

    it('should be reactive', done => {
        let cpt = 0
        viewModel.isValid$.pipe(
            skip(1) // Skip the first value, before the first change
        ).subscribe(isValid => {
            if (cpt <= 1) {
                expect(isValid).toBeFalse()
            } else {
                expect(isValid).toBeTrue()
                expect(cpt).toEqual(2)
                done()
            }
            cpt++
        })
        viewModel.textViewModel.value = 'Tommy'
        viewModel.emailViewModel.value = 'tommy@mail.com'
        viewModel.numberViewModel.value = 22
    })

    it('should throw an error if the form has no registered inputs', () => {
        const viewModel = new class extends FormViewModel<any> {
            public getInputs(): BaseViewModel<unknown>[] {
                return []
            }
        }
        expect(viewModel.validateForm).toThrow()
    })

    it('should set all field readonly when calling setReadonly(true)', () => {
        expect(viewModel.textViewModel.readonly).toBeFalse()
        expect(viewModel.emailViewModel.readonly).toBeFalse()
        expect(viewModel.numberViewModel.readonly).toBeFalse()
        expect(viewModel.secretViewModel.readonly).toBeFalse()

        viewModel.setReadonly(true)
        expect(viewModel.textViewModel.readonly).toBeTrue()
        expect(viewModel.emailViewModel.readonly).toBeTrue()
        expect(viewModel.numberViewModel.readonly).toBeTrue()
        expect(viewModel.secretViewModel.readonly).toBeFalse()
    })

    it('should set all field disabled when calling setDisabled(true)', () => {
        expect(viewModel.textViewModel.disabled).toBeFalse()
        expect(viewModel.emailViewModel.disabled).toBeFalse()
        expect(viewModel.numberViewModel.disabled).toBeFalse()
        expect(viewModel.secretViewModel.disabled).toBeFalse()
        viewModel.setDisabled(true)
        expect(viewModel.textViewModel.disabled).toBeTrue()
        expect(viewModel.emailViewModel.disabled).toBeTrue()
        expect(viewModel.numberViewModel.disabled).toBeTrue()
        expect(viewModel.secretViewModel.disabled).toBeFalse()
    })

    it('should be able to set fields value from a JS object', () => {
        expect(viewModel.textViewModel.value).toBeEmpty()
        expect(viewModel.emailViewModel.value).toBeEmpty()
        expect(viewModel.numberViewModel.value).toBeUndefined()

        viewModel.setValues({
            text: 'Tommy',
            email: 'test@test.ca',
            number: 123,
        })

        expect(viewModel.textViewModel.value).toEqual('Tommy')
        expect(viewModel.emailViewModel.value).toEqual('test@test.ca')
        expect(viewModel.numberViewModel.value).toEqual(123)
    })

})