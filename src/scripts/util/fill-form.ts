import { generateFormData } from "./generate-form-data";
import {
    CheckboxInput,
    FormInput,
    getSelectedForm,
    RadioInput,
    TextInput,
} from "./get-selected-form";

function type(element: HTMLInputElement, text: string) {
    if (!element || !text) {
        console.error("Element and text must be provided");
        return;
    }

    element.focus();
    element.dispatchEvent(new Event("focus", { bubbles: true }));
    element.value = "";
    for (let char of text) {
        // Create and dispatch keydown event
        let keydownEvent = new KeyboardEvent("keydown", {
            key: char,
            bubbles: true,
        });
        element.dispatchEvent(keydownEvent);

        // Create and dispatch keypress event
        let keypressEvent = new KeyboardEvent("keypress", {
            key: char,
            bubbles: true,
        });
        element.dispatchEvent(keypressEvent);

        // Set the value of the input element
        element.value += char;

        // Create and dispatch input event
        let inputEvent = new Event("input", { bubbles: true });
        element.dispatchEvent(inputEvent);
    }

    element.dispatchEvent(new Event("change", { bubbles: true }));

    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        which: 13,
        keyCode: 13,
        bubbles: true,
        cancelable: true,
    });
    element.dispatchEvent(enterEvent);
}
export async function fillForm(index: number, input?: string): Promise<void> {
    // transform selected form to processable format
    const formInputs = getSelectedForm(index);
    // generate input data for for based on random or input
    const generatedData = await generateFormData(formInputs, input);
    generatedData.inputs.forEach((input: FormInput) => {
        const inputElement = input.id
            ? (document.getElementById(input.id) as HTMLInputElement)
            : null;
        if (inputElement) {
            switch (input.type) {
                case "text":
                case "textarea":
                case "email":
                case "number":
                    if (input.id) {
                        type(inputElement, (input as TextInput).value ?? "");
                    }
                    break;
                case "radio":
                case "checkbox":
                    if (input.id) {
                        inputElement.checked =
                            (input as RadioInput | CheckboxInput).options.find((o) => o.checked)
                                ?.checked ?? false;
                    }
                    break;
            }
        }
    });
    console.log("Generated Data:", generatedData);
}
