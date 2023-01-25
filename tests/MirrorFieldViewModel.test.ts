import 'jest-extended';
import { FormErrors } from '../src/forms/errors/FormErrors';
import { PasswordFieldViewModel } from '../src/forms/viewmodels/fields/PasswordFieldViewModel';
import { MirrorFieldViewModel } from '../src/forms/viewmodels/fields/MirrorFieldViewModel';

describe('PasswordFieldViewModel Tests', () => {

    let passwordViewModel: PasswordFieldViewModel;
    let mirrorViewModel: MirrorFieldViewModel;

    beforeEach(() => {
        passwordViewModel = new PasswordFieldViewModel({
            name: 'password',
            required: true
        })

        mirrorViewModel = new MirrorFieldViewModel({
            name: 'mirror',
            mirrors: passwordViewModel,
            icon: 'lock',
            placeholder: 'placeholder',
            label: 'Password confirmation',
            hint: 'Enter your password again',
            readonly: false,
            disabled: false,
        })
    })

    it('should be initialized properly', () => {
        expect(mirrorViewModel.name).toEqual('mirror')
        expect(mirrorViewModel.required).toBeTrue()
        expect(mirrorViewModel.placeholder).toEqual('placeholder')
        expect(mirrorViewModel.label).toEqual('Password confirmation')
        expect(mirrorViewModel.hint).toEqual('Enter your password again')
        expect(mirrorViewModel.icon).toEqual('lock')
        expect(mirrorViewModel.readonly).toBeFalse()
        expect(mirrorViewModel.disabled).toBeFalse()
        expect(mirrorViewModel.type).toEqual('password')
        expect(mirrorViewModel.value).toEqual('')
    })

    it('should not validate an empty value', done => {
        mirrorViewModel.value = ''
        mirrorViewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        });
    })

    it('should not validate two values that doesnt match', done => {
        passwordViewModel.value = 'pAssw0rd1'
        mirrorViewModel.value = 'pAssw0rd2'
        mirrorViewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.FIELDS_DOESNT_MATCH])
            done()
        });
    })

    it('should validate two values that match', done => {
        passwordViewModel.value = 'pAssw0rd2'
        mirrorViewModel.value = 'pAssw0rd2'
        mirrorViewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual('pAssw0rd2')
            done()
        });
    })
})