import 'jest-extended';
import { FormErrors } from '../src/forms/errors/FormErrors';
import { TextFieldViewModel } from '../src/forms/viewmodels/fields/TextFieldViewModel';

describe('TextFieldViewModel Tests', () => {
    
    let viewModel: TextFieldViewModel;
    beforeEach(() => {
        viewModel = new TextFieldViewModel({
            name: 'firstname',
            required: true,
            placeholder: 'Arthur',
            label: 'Firstname',
            hint: 'Enter your firstname',
            icon: 'fa-user',
            readonly: false,
            disabled: false,
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('firstname')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('Arthur')
        expect(viewModel.label).toEqual('Firstname')
        expect(viewModel.hint).toEqual('Enter your firstname')
        expect(viewModel.icon).toEqual('fa-user')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.minLength).toEqual(0)
        expect(viewModel.maxLength).toEqual(Number.MAX_VALUE)
        expect(viewModel.regex).toBeUndefined()
        expect(viewModel.type).toEqual('text')
        expect(viewModel.value).toEqual('')
    })

    it('should validate a valid value', done => {
        viewModel.value = 'Olivier'
        viewModel.minLength = 3
        viewModel.maxLength = 10
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual('Olivier')
            done()
        });
    })

    it('should not validate an empty value, since the field is mendatory', done => {
        viewModel.value = ''
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        });
    })

    it('should not validate a value that is too short', done => {
        viewModel.value = 'AB'
        viewModel.minLength = 3
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MIN_LENGTH_REQUIRED])
            done()
        });
    });

    it('should not validate a value that is too long', done => {
        viewModel.value = 'ABCD'
        viewModel.maxLength = 3
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MAX_LENGTH_OVERFLOW])
            done()
        });
    });


    it('should not validate a value that does not match the regex', done => {
        viewModel.value = 'ABCD'
        viewModel.regex = /^[a-z]+$/
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.INVALID_FORMAT])
            done()
        });
    });

    it('should validate a value that matches the regex', done => {
        viewModel.value = 'abcd'
        viewModel.regex = /^[a-z]+$/
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual('abcd')
            done()
        });
    })

    it('should populate initial value if given', done => {
        const viewModel = new TextFieldViewModel({
            name: 'firstname',
            required: true,
            value: 'Arthur'
        });

        expect(viewModel.value).toEqual('Arthur')
        viewModel.value$.subscribe(value => {
            expect(value).toEqual('Arthur')
            done()
        })
    })
})