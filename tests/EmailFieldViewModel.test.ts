import 'jest-extended';
import { FormErrors } from '../src/forms/errors/FormErrors';
import { EmailFieldViewModel } from '../src/forms/viewmodels/fields/EmailFieldViewModel';

describe('EmailFieldViewModel should validate his value properly', () => {
    
    let viewModel: EmailFieldViewModel;
    beforeEach(() => {
        viewModel = new EmailFieldViewModel({
            name:'emailTest',
            required: true,
            placeholder: 'placeholder',
            label: 'label',
            hint: 'hint',
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('emailTest')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('placeholder')
        expect(viewModel.label).toEqual('label')
        expect(viewModel.hint).toEqual('hint')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('email')
        expect(viewModel.value).toEqual('')
    })

    it('should not validate an empty email, since the field is mendatory', done => {
        viewModel.value = ''
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_EMAIL_ADDRESS,
                FormErrors.REQUIRED_FIELD
            ])
            done()
        });
    })

    it('should not validate invalid email adresses', done => {
        viewModel.value = 'test.test.ca'
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_EMAIL_ADDRESS
            ])
            done()
        });
    })

    it('should not validate invalid email adresses 2', done => {
        viewModel.value = 'test@test'
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_EMAIL_ADDRESS
            ])
            done()
        });
    })

    it('should not validate invalid email adresses 3', done => {
        viewModel.value = '@test.ca'
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_EMAIL_ADDRESS
            ])
            done()
        });
    })

    it('should validate correct email adresses', done => {
        viewModel.value = 'test@test.ca'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeTrue()
            done()
        })
    })

    it('should not change value if readonly', () => {
        viewModel.value = "test1@gmail.com";
        viewModel.readonly = true;
        viewModel.value = "test2@gmail.com";
        expect(viewModel.value).toEqual("test1@gmail.com");
    })
})