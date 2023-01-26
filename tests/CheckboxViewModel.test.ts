import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { CheckboxViewModel } from '../src/fields/CheckboxViewModel';

describe('CheckboxViewModel should validate his value properly', () => {

    let viewModel: CheckboxViewModel;
    beforeEach(() => {
        viewModel = new CheckboxViewModel({
            name: 'checkbox',
            required: false,
            label: 'label',
            hint: 'hint',
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('checkbox')
        expect(viewModel.required).toBeFalse()
        expect(viewModel.placeholder).toBeUndefined()
        expect(viewModel.label).toEqual('label')
        expect(viewModel.hint).toEqual('hint')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('checkbox')
        expect(viewModel.value).toEqual(false)
    })

    it('optionnal checkbox should be valid if unchecked', done => {
        viewModel.value = false;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeTrue()
            expect(result.value).toBeFalse()
            done()
        })
    })

    it('optionnal checkbox should be valid if checked', done => {
        viewModel.value = true;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeTrue()
            expect(result.value).toBeTrue()
            done()
        })
    })

    it('required checkbox should be invalid if unchecked', done => {
        viewModel.required = true;
        viewModel.value = false;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        })
    })

    it('required checkbox should be valid if checked', done => {
        viewModel.required = true;
        viewModel.value = true;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeTrue()
            expect(result.value).toBeTrue()
            done()
        })
    })

    it('should not change value if readonly', () => {
        viewModel.value = true;
        viewModel.readonly = true;
        viewModel.value = false;
        expect(viewModel.value).toBeTrue()
    })
})