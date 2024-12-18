import { fillForm } from "./util/fill-form";
import { getForms } from "./util/get-forms";
import { handleStartRecording, handleStopRecording, insertTextarea } from "./util/handle-recording";

console.log("Nano Form Filler - Content Script");

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse: (response: { success: boolean; error?: string }) => void) => {
        switch (request.action) {
            case "autoFillFormButton":
                void fillForm(request.data.index);
                break;

            case "loadForms":
                getForms(true);
                break;

            case "startRecording":
                handleStartRecording(sendResponse);
                break;

            case "stopRecording":
                handleStopRecording(sendResponse);
                break;
            case "insertTextarea":
                insertTextarea(request.data.text, request.data.index, request.data.isRecording);
                break;

            default:
                console.warn("Unknown action:", request.action);
                sendResponse({
                    success: false,
                    error: `Unknown action: ${request.action}`,
                });
                break;
        }
        return true; // Will respond asynchronously
    },
);
