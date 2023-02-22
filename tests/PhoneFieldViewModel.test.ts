import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { PhoneFieldViewModel } from '../src/fields/PhoneFieldViewModel';

describe('PhoneFieldViewModel should validate his value properly', () => {
    
    let viewModel: PhoneFieldViewModel;
    beforeEach(() => {
        viewModel = new PhoneFieldViewModel({
            name:'phoneTest',
            required: true,
            placeholder: 'placeholder',
            label: 'label',
            hint: 'hint',
            locale: 'en-US'
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('phoneTest')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('placeholder')
        expect(viewModel.label).toEqual('label')
        expect(viewModel.hint).toEqual('hint')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('tel')
        expect(viewModel.value).toEqual('')
        expect(viewModel.locale).toEqual('en-US')
    })

    it('should not validate an empty phone number if the field is mendatory', done => {
        viewModel.value = ''
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.REQUIRED_FIELD,
                FormErrors.INVALID_PHONE_NUMBER,
            ])
            done()
        });
    })

    it('should not validate invalid phone number', done => {
        viewModel.value = '1514555000'
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_PHONE_NUMBER
            ])
            done()
        });
    })

    it('should not validate invalid phone number 2', done => {
        viewModel.value = 'not a phone number'
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([
                FormErrors.INVALID_PHONE_NUMBER
            ])
            done()
        });
    })

    it('should validate correct phone number from choosen locale', done => {
        viewModel.value = '15145520607'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeTrue()
            done()
        })
    })

    it('should validate correct phone number from choosen locale', done => {
        viewModel.value = '+1 514-552-0607'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeTrue()
            done()
        })
    })

    it('should validate correct phone number without country code', done => {
        viewModel.value = '5145520607'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeTrue()
            done()
        })
    })

    it('should not accept phone number from another locale', done => {
        viewModel.value = '33610203010'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeFalse()
            done()
        })
    })

    it('should accept foreign phone number if included in the locale list', done => {
        viewModel.value = '33610203010'
        viewModel.locale = 'fr-FR'
        viewModel.isValid$.subscribe(result => {
            expect(result).toBeTrue()
            done()
        })
    })

    it('should not change value if readonly', () => {
        viewModel.value = "15145550000";
        viewModel.readonly = true;
        viewModel.value = "15145551111";
        expect(viewModel.value).toEqual("15145550000");
    })
})