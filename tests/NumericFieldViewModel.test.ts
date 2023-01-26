import 'jest-extended';
import { FormErrors } from '../src/forms/errors/FormErrors';
import { NumericFieldViewModel } from '../src/forms/viewmodels/fields/NumericFieldViewModel';

describe('NumericFieldViewModel Tests', () => {
    
    let viewModel: NumericFieldViewModel;
    beforeEach(() => {
        viewModel = new NumericFieldViewModel({
            name: 'age',
            required: true,
            integer: true,
            placeholder: '22',
            minValue: 1,
            maxValue: 100,
            label: 'Age',
            hint: 'Enter your age',
            icon: 'fa-cake'
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('age')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('22')
        expect(viewModel.label).toEqual('Age')
        expect(viewModel.hint).toEqual('Enter your age')
        expect(viewModel.icon).toEqual('fa-cake')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.minValue).toEqual(1)
        expect(viewModel.maxValue).toEqual(100)
        expect(viewModel.integer).toBeTrue()
        expect(viewModel.type).toEqual('number')
        expect(viewModel.value).toBeUndefined()
    })

    it('should validate a valid number', done => {
        viewModel.value = 24
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual(24)
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

    it('should not accept a value that is less than min value', done => {
        viewModel.value = 0
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MIN_VALUE_OVERFLOW])
            done()
        });
    });

    it('should not accept a value that is grater than max value', done => {
        viewModel.value = 101
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MAX_VALUE_OVERFLOW])
            done()
        });
    });

    it('should not accept decimal if integer=true', done => {
        viewModel.value = 1.234
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.NOT_AN_INTEGER])
            done()
        });
    });

    it('should accept integer values even if integer=false', done => {
        viewModel.integer = false;
        viewModel.value = 1
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            done()
        });
    });


    it('should not change value if readonly', () => {
        viewModel.value = 1;
        viewModel.readonly = true;
        viewModel.value = 2;
        expect(viewModel.value).toEqual(1);
    })
})