import { SelectedForm } from "../../models/selected-form";

function getSystemPrompt(output: Object) {
    return `
        You are a assistant that should help with filling forms automatically.
        You generate data for a form based on the users input.
        Extract the information to a JSON object of this shape:
        ${JSON.stringify(output)}

        If you cant generate the information for a field, leave it empty.
        Answer only with the JSON object.
        Do not add any other text.
        Do only generate values with the latin alphabet, numbers or booleans.
        Do not use any special characters or emojis.
        DO not use the most common languages.
    `;
}

export async function generateFormData(form: SelectedForm, input?: string) {
    // format a json object for output
    const output: Record<string, unknown> = {};
    const additions: string[] = [];
    for (const [key, input] of form.entries()) {
        switch (input.type) {
            case "checkbox":
                output[key] = false;
                break;
            default:
                output[key] = "";
        }
    }

    console.log("Running prompt");
    const session = await window.ai.languageModel.create({
        systemPrompt: getSystemPrompt(output),
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
