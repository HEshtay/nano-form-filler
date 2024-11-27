import { FormStructure } from "./get-selected-form";

function getSystemPrompt(output: Object) {
    return `
        You are a assistant that should help with filling forms automatically.
        You generate data for a form based on the users input.
        Extract the information to a JSON object of this shape:
        ${JSON.stringify(output, null, 2)}

        If you cant generate the information for a field, leave it empty.
        Answer only with the JSON object.
        Do not add any other text.
        Stick to the format of the JSON object.
        For type Radio and checkbox, select one of the options and mark it as checked = true.
        Do only generate values with the latin alphabet, numbers or booleans.
        Do not use any special characters or emojis.
        DO not use the most common languages.
    `;
}

export async function generateFormData(form: FormStructure | null, input?: string) {

    console.log("Running prompt");
    if (!form) {
        return;
    }
    const session = await window.ai.languageModel.create({
        systemPrompt: getSystemPrompt(form),
    });
    let reply: string = "";
    // random data on no input
    if (input == null) {
        reply = await session.prompt(`
            Generate some randomized data wich is not common but fit in the fields.
        `);
    } else {
        reply = await session.prompt(input);
    }

    return JSON.parse(reply ?? "{}");
}
