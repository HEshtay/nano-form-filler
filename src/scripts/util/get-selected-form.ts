import { SelectedForm, SelectedFormInput } from "../../models/selected-form";
import { getForms } from "./get-forms";

export function getSelectedForm(index: number) {
    const forms = getForms();
    const selectedForm = forms[index];
    const inputs: SelectedForm = new Map<string, SelectedFormInput>();
    selectedForm.querySelectorAll("input").forEach((input) => {
        const inputKey = input.name !== "" ? input.name : input.id;
        if (!inputs.has(inputKey)) {
            inputs.set(inputKey, {
                label: input.name ?? "",
                placeholder: input.placeholder ?? "",
                type: input.getAttribute("type") || "text",
                values: [],
            });
        }
        // if radio add values
        if (input.type === "radio") {
            inputs.get(inputKey)?.values.push(input.value);
        }
    });
    return inputs;
}