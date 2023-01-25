import 'jest-extended';
import { skip } from 'rxjs/operators';
import { TextFieldViewModel } from '../src/forms/viewmodels/fields/TextFieldViewModel';
import { FormViewModel } from '../src/forms/viewmodels/FormViewModel';
import { ValidatableInput } from '../src/forms/viewmodels/ValidatableInput';

class TestFormViewModel extends FormViewModel<any> {

    firstName = new TextFieldViewModel({
        name: 'firstName',
        required: true,
        label: 'First name'
    })

    lastName = new TextFieldViewModel({
        name: 'lastName',
        required: true,
        label: 'Last name'
    })

    public getInputs(): ValidatableInput<unknown>[] {
        return [
            this.firstName,
            this.lastName
        ]
    }
}

describe('FormViewModel Tests', () => {
    
    let viewModel: TestFormViewModel;
    beforeEach(() => {
        viewModel = new TestFormViewModel()
    })

    it('should not be valid if one ore more field is not valid', done => {
        viewModel.firstName.value = 'Olivier'
        viewModel.isValid$.subscribe(isValid => {
            expect(isValid).toBeFalse()
            done()
        })
    })

    it('should throw an error if one ore more field is not valid when using validateForm', done => {
        viewModel.firstName.value = 'Olivier'
        viewModel.validateForm().subscribe({
            next: () => {
                fail('Should not be called')
            },
            error: err => {
                console.log(err.message)
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toEqual('One or more fields of this form are invalid, check error.cause for details.')
                done()
            }
        })
    })

    it('should be valid if all fields are valid', done => {
        viewModel.firstName.value = 'Tommy'
        viewModel.lastName.value = 'Shelby'
        viewModel.isValid$.subscribe(isValid => {
            expect(isValid).toBeTrue()
            done()
        })
    })

    it('should return the form data when validated', done => {
        viewModel.firstName.value = 'Tommy'
        viewModel.lastName.value = 'Shelby'
        viewModel.validateForm().subscribe(data => {
            expect(data).toEqual({
                firstName: 'Tommy',
                lastName: 'Shelby'
            })
            done()
        })
    })

    it('should be reactive', done => {
        let cpt = 0
        viewModel.isValid$.pipe(
            skip(1) // Skip the first value, before the first change
        ).subscribe(isValid => {
            cpt++
            if (cpt === 1) {
                expect(isValid).toBeFalse()
            } else {
                expect(isValid).toBeTrue()
                expect(cpt).toEqual(2)
                done()
            }
        })
        viewModel.firstName.value = 'Tommy'
        viewModel.lastName.value = 'Shelby'
    })

    it('should throw an error if the form has no registered inputs', () => {
        const viewModel = new class extends FormViewModel<any> {
            public getInputs(): ValidatableInput<unknown>[] {
                return []
            }
        }
        expect(viewModel.validateForm).toThrow()
    })
})