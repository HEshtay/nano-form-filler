import { generateFormData } from "./generate-form-data";
import { getSelectedForm } from "./get-selected-form";

export async function fillForm(index: number, input?: string): Promise<void> {
    // transform selected form to processable format
    const formInputs = getSelectedForm(index);
    // generate input data for for based on random or input
    const generatedData = await generateFormData(formInputs, input);
    console.log("Generated Data:", generatedData);
}
