import { actionInCurrentTab } from "./util/action-in-current-tab";
import { fillFormSelect } from "./util/fill-form-select";
import { getSelectedFormIndex } from "./util/get-selected-form-index";
import { initializeMicrophone } from "./util/initialize-microphone";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM ready");
    initializeMicrophone();

    document.getElementById("loadFormsButton")?.addEventListener("click", () => {
        actionInCurrentTab("loadForms");
    });

    document.getElementById("autoFillFormButton")?.addEventListener("click", () => {
        actionInCurrentTab("autoFillFormButton", {
            index: getSelectedFormIndex(),
        });
    });

    document.getElementById("startRecordingButton")?.addEventListener("click", () => {
        console.log("startRecordingButton");
        actionInCurrentTab("startRecording");
    });

    document.getElementById("stopRecordingButton")?.addEventListener("click", () => {
        console.log("stopRecordingButton");
        actionInCurrentTab("stopRecording");
    });

    setTimeout(async () => {
        console.log("onStartup");
        actionInCurrentTab("loadForms");
    }, 250);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "formsLoaded":
            fillFormSelect(request.data.titles);
            break;
        default:
            break;
    }
    return undefined;
});
