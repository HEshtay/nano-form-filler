import { getForms } from "./get-forms";

export interface InputOption {
    value: string;
    id?: string;
    label: string;
    checked?: boolean;
}

interface BaseInput {
    type: string;
    id: string | null;
    name: string | null;
    element?: HTMLInputElement;
}

export interface TextInput extends BaseInput {
    placeholder?: string;
    value?: string | null;
}

export interface RadioInput extends BaseInput {
    options: InputOption[];
}

export interface CheckboxInput extends BaseInput {
    options: InputOption[];
}

interface SelectInput extends BaseInput {
    options: InputOption[];
    selected?: string | number | null;
}

export type FormInput = TextInput | RadioInput | CheckboxInput | SelectInput;

export interface FormStructure {
    formId: string;
    inputs: FormInput[];
}

export function getSelectedForm(index: number): FormStructure | null {
    const forms = getForms();
    const selectedForm = forms[index];

    // Get the path of the selected form
    let formPath: string | undefined;
    if (selectedForm && !selectedForm.id) {
        formPath = getFormPath(selectedForm);
    }

    const capturedForm = captureFormStructure(selectedForm?.id, formPath);
    console.log("-------------------------------------------");
    console.log(JSON.stringify(capturedForm, null, 2));
    console.log("-------------------------------------------");
    console.log("Captured Form:", capturedForm);
    return capturedForm;
}

// Helper function to get the path of the form
function getFormPath(form: HTMLFormElement): string {
    let path = form.tagName.toLowerCase();
    let parent = form.parentElement;
    while (parent) {
        path = `${parent.tagName.toLowerCase()} > ${path}`;
        parent = parent.parentElement;
    }
    return path;
}

function captureFormStructure(formId?: string, formPath?: string): FormStructure | null {
    let form: HTMLFormElement | null = null;

    if (formId) {
        form = document.getElementById(formId) as HTMLFormElement | null;
    } else if (formPath) {
        form = document.querySelector(formPath);
    }

    if (form) {
        return extractFormStructure(form, formId || formPath || "unknown-form");
    } else {
        // If both formId and formPath are undefined, search directly for input elements
        const inputs = document.querySelectorAll("input, textarea, select");

        if (inputs.length === 0) {
            console.error("No input elements found.");
            return null;
        }

        const formStructure: FormStructure = {
            formId: "direct-input-search",
            inputs: [],
        };

        extractInputs(inputs, formStructure);
        console.log("Direct input search:", formStructure);
        return formStructure;
    }
}

function extractFormStructure(form: HTMLFormElement, formIdentifier: string): FormStructure | null {
    const inputs = form.querySelectorAll("input, textarea, select");
    if (inputs.length === 0) {
        console.error("No input elements found in the form.");
        return null;
    }

    const formStructure: FormStructure = {
        formId: form.id || formIdentifier,
        inputs: [],
    };

    extractInputs(inputs, formStructure);
    return formStructure;
}

function extractInputs(
    inputs: NodeListOf<Element | HTMLInputElement>,
    formStructure: FormStructure,
): void {
    inputs.forEach((element) => {
        const { type, id, name, placeholder, value, checked } = element as HTMLInputElement;

        const baseInput: BaseInput = {
            type: element.tagName.toLowerCase() === "textarea" ? "textarea" : type,
            id: id || null,
            name: name || null,
            element: element as HTMLInputElement,
        };

        switch (baseInput.type) {
            case "text":
            case "email":
            case "date":
            case "number":
            case "password":
            case "url":
            case "tel": {
                const textInput: TextInput = {
                    ...baseInput,
                    placeholder: placeholder || "",
                    value: value || null,
                };
                formStructure.inputs.push(textInput);
                break;
            }
            case "radio": {
                const radioOption: InputOption = {
                    value,
                    id: id,
                    label: (element as HTMLInputElement).labels?.[0]
                        ? (element as HTMLInputElement).labels?.[0].textContent || value
                        : value,
                    checked: checked || false,
                };

                const existingRadioGroup = formStructure.inputs.find(
                    (inp) => inp.type === "radio" && inp.name === name,
                ) as RadioInput | undefined;

                if (existingRadioGroup) {
                    existingRadioGroup.options.push(radioOption);
                } else {
                    const radioInput: RadioInput = {
                        ...baseInput,
                        options: [radioOption],
                    };
                    formStructure.inputs.push(radioInput);
                }
                break;
            }
            case "checkbox": {
                const checkboxOption: InputOption = {
                    value,
                    id: id,
                    label: (element as HTMLInputElement).labels?.[0]
                        ? (element as HTMLInputElement).labels?.[0].textContent || value
                        : value,
                    checked: checked || false,
                };

                const existingCheckboxGroup = formStructure.inputs.find(
                    (inp) => inp.type === "checkbox" && inp.name === name,
                ) as CheckboxInput | undefined;

                if (existingCheckboxGroup) {
                    existingCheckboxGroup.options.push(checkboxOption);
                } else {
                    const checkboxInput: CheckboxInput = {
                        ...baseInput,
                        options: [checkboxOption],
                    };
                    formStructure.inputs.push(checkboxInput);
                }
                break;
            }
            case "select-one": {
                const selectInput: SelectInput = {
                    ...baseInput,
                    type: "select",
                    options: [],
                };
                for (let option of Array.from((element as HTMLSelectElement).options)) {
                    selectInput.options.push({
                        value: option.value,
                        label: option.textContent || "",
                    });
                }
                formStructure.inputs.push(selectInput);
                break;
            }
            case "textarea": {
                const textInput: TextInput = {
                    ...baseInput,
                    placeholder: placeholder || "",
                    value: value || null,
                };
                formStructure.inputs.push(textInput);
                break;
            }
            default:
                console.warn(`Unsupported input type: ${type}`);
                break;
        }
    });
}
