import 'jest-extended';
import { z } from 'zod';
import { FormErrors } from '../src/errors/FormErrors';
import { PasswordFieldViewModel } from '../src/fields/PasswordFieldViewModel';

describe('PasswordFieldViewModel Tests', () => {
    
    let viewModel: PasswordFieldViewModel;
    beforeEach(() => {
        viewModel = new PasswordFieldViewModel({
            name: 'password',
            required: true,
            placeholder: 'placeholder',
            label: 'Password',
            hint: 'Enter your password',
            readonly: false,
            disabled: false,
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('password')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('placeholder')
        expect(viewModel.label).toEqual('Password')
        expect(viewModel.hint).toEqual('Enter your password')
        expect(viewModel.icon).toBeUndefined()
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.minLength).toEqual(0)
        expect(viewModel.maxLength).toEqual(Number.MAX_VALUE)
        expect(viewModel.regex).toBeUndefined()
        expect(viewModel.type).toEqual('password')
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
        viewModel.value = 'abcd!e'
        viewModel.regex = /(?=.*\d.*)(?=.*[a-zA-Z].*)(?=.*[!#\$%&\?].*).{8,}/
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.INVALID_FORMAT])
            done()
        });
    });

    it('should validate a value that matches the regex', done => {
        viewModel.value = 'Passw0rd!'
        viewModel.regex = /(?=.*\d.*)(?=.*[a-zA-Z].*)(?=.*[!#\$%&\?].*).{8,}/
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual('Passw0rd!')
            done()
        });
    })

    it('should populate initial value if given', done => {
        const viewModel = new PasswordFieldViewModel({
            name: 'password',
            required: true,
            value: 'myPassword'
        });

        expect(viewModel.value).toEqual('myPassword')
        viewModel.value$.subscribe(value => {
            expect(value).toEqual('myPassword')
            done()
        })
    })
})