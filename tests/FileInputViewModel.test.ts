import 'jest-extended';
import { FileInputViewModel } from '../src/fields/FileInputViewModel';
import { FormErrors } from '../src/errors/FormErrors';

describe.only('FileInputViewModel Tests', () => {
    
    let viewModel: FileInputViewModel;
    beforeEach(() => {
        viewModel = new FileInputViewModel({
            name: 'testFile',
            required: true,
            placeholder: 'placeholder',
            label: 'label',
            hint: 'hint',
            allowedExtensions: ['jpg', 'png'],
            maxSizeKb: 1,
        })
    })

    it('should be initialized properly', () => {
        expect(viewModel.name).toEqual('testFile')
        expect(viewModel.required).toBeTrue()
        expect(viewModel.placeholder).toEqual('placeholder')
        expect(viewModel.label).toEqual('label')
        expect(viewModel.hint).toEqual('hint')
        expect(viewModel.readonly).toBeFalse()
        expect(viewModel.disabled).toBeFalse()
        expect(viewModel.type).toEqual('file')
        expect(viewModel.value).toBeUndefined()
        expect(viewModel.allowedExtensions).toEqual(['jpg', 'png'])
        expect(viewModel.maxSizeKb).toEqual(1)
    })

    it('should not accept undefined file if required', done => {
        viewModel.value = undefined
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.REQUIRED_FIELD])
            done()
        });
    })

    it('should accept a valid file', done => {
        const file = new File(['(⌐□_□)'], 'test.jpg', { type: 'image/jpg' })
        viewModel.value = file
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            expect(validation.value).toEqual(file)
            done()
        });
    })

    it('should not accept an invalid extension', done => {
        viewModel.value = new File(['1010101'], 'test.wav', { type: 'audio/wav' })
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.FILE_EXTENSION_NOT_ALLOWED])
            done()
        });
    })

    it('should not accept an invalid size', done => {
        // String of 2kb size
        let data = '';
        for (let i = 0; i < 1024 * 2; i++) {
            data += '0';
        }

        viewModel.value = new File([data], 'test.jpg', { type: 'image/jpg' })
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeFalse()
            expect(validation.errors).toEqual([FormErrors.FILE_SIZE_TOO_LARGE])
            done()
        });
    })

    it('should accept undefined if not required', done => {
        viewModel.required = false
        viewModel.value = undefined
        viewModel.validation$.subscribe(validation => {
            expect(validation.result).toBeTrue()
            done()
        });
    })
})