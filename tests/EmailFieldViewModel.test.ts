import 'jest-extended';
import { EmailFieldViewModel } from '../src/index';
import { FormErrors } from '../src/forms/errors/FormErrors';

describe('EmailFieldViewModel should validate his value properly', () => {
    
    let viewModel: EmailFieldViewModel;
    beforeAll(() => {
        viewModel = new EmailFieldViewModel({
            name:'emailTest',
            required: true,
        })
    })

    it('should not validate an empty email, since the field is mendatory', () => {
        viewModel.value = ''
        viewModel.validate((result, error) =>{
            expect(result).toBeFalse()
            expect(error).toBe(FormErrors.REQUIRED_FIELD)
        })
    })

    it('should not validate malformed email adresses', () => {
        viewModel.value = 'test.test.ca'
        viewModel.validate((result, error) =>{
            expect(result).toBeFalse()
            expect(error).toBe(FormErrors.INVALID_EMAIL_ADDRESS)
        })

        viewModel.value = 'test@test'
        viewModel.validate((result, error) =>{
            expect(result).toBeFalse()
            expect(error).toBe(FormErrors.INVALID_EMAIL_ADDRESS)
        })

        viewModel.value = '@test.ca'
        viewModel.validate((result, error) =>{
            expect(result).toBeFalse()
            expect(error).toBe(FormErrors.INVALID_EMAIL_ADDRESS)
        })
    })

    it('should validate correct email adresses', () => {
        viewModel.value = 'test@test.ca'
        viewModel.validate((result, error) =>{
            expect(result).toBeTrue()
            expect(error).toBeUndefined()
        })
    })
})