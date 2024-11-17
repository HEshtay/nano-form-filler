import { fillForm } from "./util/fill-form";
import { getForms } from "./util/get-forms";

console.log("Nano Form Fille - Content Script");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "autoFillFormButton":
            fillForm(request.data.index);
            break;
        case "loadForms":
            getForms(true);
            break;
        default:
            break;
    }
    sendResponse();
    return undefined;
});
