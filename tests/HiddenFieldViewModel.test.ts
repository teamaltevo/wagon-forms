import 'jest-extended';
import { FormErrors } from '../src/errors/FormErrors';
import { HiddenFieldViewModel } from '../src/fields/HiddenFieldViewModel';

interface TestObject {
    test: string;
    test2: boolean;
}

describe('TextFieldViewModel Tests', () => {
    let testValue: TestObject = {
        test: 'test',
        test2: true,
    };

    let viewModel: HiddenFieldViewModel<TestObject>;
    beforeEach(() => {
        viewModel = new HiddenFieldViewModel({
            name: 'hidden',
            required: true,
            value: testValue,
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('hidden')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('hidden')
        expect(viewModel.value).toEqual(testValue)
    })

    it('should be valid if value is set', done => {
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeTrue()
            expect(result.value).toEqual({
                test: 'test',
                test2: true,
            })
            done()
        })
    })

    it('should be invalid if value is not set', done => {
        viewModel.value = undefined;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeFalse()
            expect(result.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        })
    })

    it('should be valid if value is not set but field is optionnal', done => {
        viewModel.value = undefined;
        viewModel.required = false;
        viewModel.validation$.subscribe(result => {
            expect(result.result).toBeTrue()
            done()
        })
    })

    it('clear should not change value', () => {
        viewModel.clear();
        expect(viewModel.value).toEqual({
            test: 'test',
            test2: true,
        })
    });
})