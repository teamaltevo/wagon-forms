import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { TextFieldViewModel } from '../src/fields/TextFieldViewModel';
import { ErrorMessageFactoryProvider } from '../src/interfaces/ErrorMessageFactory';

describe('TextFieldViewModel Tests', () => {
    
    let viewModel: TextFieldViewModel;

    let errorMessageFactory = ErrorMessageFactoryProvider({
        [FormErrors.REQUIRED_FIELD]: 'This field is required',
        // [FormErrors.MIN_LENGTH_REQUIRED]: 'This field must be at least n characters long',
    })

    beforeEach(() => {
        viewModel = new TextFieldViewModel({
            name: 'test',
            required: true,
        })
    })


    it('should replace the error code by the defined message from the errorMessageFactory', done => {
        viewModel.value = ''
        viewModel.errorsForDisplay$(errorMessageFactory).subscribe(errors => {
            expect(errors).toEqual(['This field is required'])
            done()
        });
    })
    

    it('should use the default error if is not overloaded in errorMessageFactory', done => {
        viewModel.value = 'AB'
        viewModel.minLength = 3
        viewModel.errorsForDisplay$(errorMessageFactory).subscribe(errors => {
            expect(errors).toEqual([FormErrors.MIN_LENGTH_REQUIRED])
            done()
        });
    });

})