import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { DateFieldViewModel } from '../src/fields/DateFieldViewModel';

describe('DateFieldViewModel Tests', () => {
    
    let viewModel: DateFieldViewModel;
    beforeEach(() => {
        viewModel = new DateFieldViewModel({
            name: 'date',
            required: true,
            minDate: new Date(2022, 0, 1),
            maxDate: new Date(2023, 0, 1),
            label: 'Start Date',
            hint: 'Please pick a date',
            placeholder: 'Pick a date'
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('date')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('Pick a date')
        expect(viewModel.label).toEqual('Start Date')
        expect(viewModel.hint).toEqual('Please pick a date')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.minDate).toEqual(new Date(2022, 0, 1))
        expect(viewModel.maxDate).toEqual(new Date(2023, 0, 1))
        expect(viewModel.type).toEqual('date')
        expect(viewModel.value).toEqual(undefined)
    })

    it('should validate a valid date', done => {
        viewModel.value = new Date(2022, 6, 12);
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual(new Date(2022, 6, 12))
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

    it('should not accept a date lower than minDate', done => {
        viewModel.value = new Date(2021, 6, 12);
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MIN_DATE_OVERFLOW])
            done()
        });
    })

    it('should not accept a date higher than maxDate', done => {
        viewModel.value = new Date(2054, 6, 12);
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.MAX_DATE_OVERFLOW])
            done()
        });
    })

    it('should accept undefined if field is optionnal', done => {
        viewModel.required = false;
        viewModel.value = undefined;
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            done()
        });
    })

    it('isoValue should return a valid ISO date', done => {
        viewModel.value = new Date(2022, 6, 12);
        expect(viewModel.isoValue).toEqual('2022-07-12T04:00:00.000Z')
        viewModel.isoValue$.subscribe(isoValue => {
            expect(isoValue).toEqual('2022-07-12T04:00:00.000Z')
            done()
        });
    });

})