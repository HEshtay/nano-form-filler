import { getForms } from "./get-forms";

export function fillForm(index: number): void {
    const forms = getForms();
    const selectedForm = forms[index];
    console.log("selectedForm", selectedForm);
}
