import { BaseViewModel } from "../interfaces/BaseViewModel";
import { FormDataObject, FormViewModel } from "./FormViewModel";

export class DynamicFormViewModel<T extends FormDataObject> extends FormViewModel<T> {

    private inputs: BaseViewModel<unknown>[] = [];

    public add(input: BaseViewModel<unknown>) {
        this.inputs.push(input);
    }

    getInputs(): BaseViewModel<unknown>[] {
        return this.inputs;
    }
}