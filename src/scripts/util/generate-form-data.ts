import { FormStructure } from "./get-selected-form";

function getSystemPrompt(output: Object) {
    return `
You are an intelligent assistant specializing in automatically generating realistic data for web forms. Your task is to produce a JSON object representing form data based on specific input constraints. Follow these guidelines:
If the input alreay has value ignore it and generate new data.
Output Format:

Return only the JSON object, without any additional text, code blocks, or formatting like \`\`\`json.
Do not include explanatory text, examples, or comments—return only the JSON data.
JSON Structure:

Maintain a consistent format as provided: ${JSON.stringify(output, null, 2)}.
Data Generation Rules:

Generate realistic and contextually appropriate values.
Use only Latin alphabets, numbers, and booleans.
Avoid special characters, emojis, and repetitive data.
Input-Specific Instructions:

Special Handling of Checkboxes and Radios:
 1) For type: "radio" fields:
        Provide multiple options, each with checked set to true for one option and false for the rest.
 2) For type: "checkbox" fields:
        Include multiple options, setting checked to true for at least one and false for the others.
 This behavior is mandatory for these field types.
For text fields, ensure values like names, emails, and addresses are plausible but unique.
Leave Empty Values When Necessary:

If a field cannot be realistically filled, leave its value empty.
Clarity and Simplicity:

Avoid wrapping your response in code blocks or adding formatting markers like \`\`\`json.
Avoid adding period at the end of the JSON.
Ensure the JSON is valid and directly usable without editing.
Example JSON output:
{
  "formId": "userForm",
  "inputs": [
    {
      "type": "radio",
      "id": "gender-radio-1",
      "name": "gender",
      "element": {},
      "options": [
        { "value": "Male", "id": "gender-radio-1", "label": "Male", "checked": true },
        { "value": "Female", "id": "gender-radio-2", "label": "Female", "checked": false },
        { "value": "Other", "id": "gender-radio-3", "label": "Other", "checked": false }
      ]
    },
    {
      "type": "checkbox",
      "id": "hobbies-checkbox-1",
      "name": null,
      "element": {},
      "options": [
        { "value": "1", "id": "hobbies-checkbox-1", "label": "Sports", "checked": true }
      ]
    }
  ]
}
    `;
}

export async function generateFormData(form: FormStructure | null, input?: string) {
    console.log("Running prompt");
    if (!form) {
        return;
    }

    const session = await window.ai.languageModel.create({
        systemPrompt: getSystemPrompt(form)
    });
    let reply: string = "";
    // random data on no input
    if (input == null) {
        reply = await session.prompt(`
            Generate some randomized data different each time, wich is not common but fit in the fields.
        `);
    } else {
        reply = await session.prompt(input);
    }

    return JSON.parse(reply ?? "{}");
}
