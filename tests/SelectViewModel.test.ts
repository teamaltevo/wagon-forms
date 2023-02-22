import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { SelectViewModel } from '../src/fields/SelectViewModel';

describe('SelectViewModel Tests', () => {
    
    let viewModel: SelectViewModel;
    beforeEach(() => {
        viewModel = new SelectViewModel({
            name: 'selection',
            required: true,
            placeholder: 'placeholder',
            label: 'label',
            hint: 'hint',
            icon: 'fa-dropdown',
            readonly: false,
            disabled: false,
            options: [
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
                { value: 'opt3', label: 'Option 3' },
            ]
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('selection')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('placeholder')
        expect(viewModel.label).toEqual('label')
        expect(viewModel.hint).toEqual('hint')
        expect(viewModel.icon).toEqual('fa-dropdown')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('select')
        expect(viewModel.value).toBeUndefined()
    })

    it('should validate a valid value', done => {
        viewModel.value = 'opt3'
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual('opt3')
            done()
        });
    })

    it('should not validate a value that is not included in choices', done => {
        viewModel.value = 'opt4'
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.INVALID_OPTION])
            done()
        });
    })

    it('should not validate an empty value, since the field is mendatory', done => {
        viewModel.value = undefined
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        });
    })

    it('should allow an empty value if optional', done => {
        viewModel.required = false
        viewModel.value = undefined
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toBeUndefined()
            done()
        });
    })

    it('should populate initial value if given', done => {
        const viewModel = new SelectViewModel({
            name: 'firstname',
            required: true,
            value: 'Option 1'
        });

        expect(viewModel.value).toEqual('Option 1')
        viewModel.value$.subscribe(value => {
            expect(value).toEqual('Option 1')
            done()
        })
    })

    it('should not change value if readonly', () => {
        viewModel.value = "firstValue";
        viewModel.readonly = true;
        viewModel.value = "secondValue";
        expect(viewModel.value).toEqual("firstValue");
    })
})