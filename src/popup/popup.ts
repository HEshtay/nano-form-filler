import { actionInCurrentTab } from "./util/action-in-current-tab";
import { fillFormSelect } from "./util/fill-form-select";
import { getSelectedFormIndex } from "./util/get-selected-form-index";
import { initializeMicrophone } from "./util/initialize-microphone";

document.addEventListener("DOMContentLoaded", async () => {
    let isRecording = false;
    const startRecordingButton = document.getElementById(
        "startRecordingButton",
    ) as HTMLButtonElement;
    const stopRecordingButton = document.getElementById("stopRecordingButton") as HTMLButtonElement;

    chrome.storage.local.getKeys(async (keys) => {
        console.log("keys", keys);
        const foundKey = keys.find((key) => key === "isRecording");
        if (foundKey) {
            console.log("Found isRecording key", foundKey);
            const recording = await chrome.storage.local.get(["isRecording"]);
            isRecording = recording.isRecording;
        }
        if (isRecording && startRecordingButton) {
            console.log("Setting START RecordingButton to disabled");
            startRecordingButton.disabled = true;
            if (stopRecordingButton) {
                stopRecordingButton.disabled = false;
            }
        } else if (!isRecording && stopRecordingButton) {
            console.log("Setting STOP RecordingButton to disabled");
            stopRecordingButton.disabled = true;
            if (startRecordingButton) {
                startRecordingButton.disabled = false;
            }
        }
    });
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

    startRecordingButton?.addEventListener("click", () => {
        console.log("startRecordingButton");
        actionInCurrentTab("startRecording");
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
        actionInCurrentTab("insertTextarea", { text: '', isRecording: true, index: getSelectedFormIndex() });
    });

    stopRecordingButton?.addEventListener("click", () => {
        console.log("stopRecordingButton");
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
        actionInCurrentTab("stopRecording");
        actionInCurrentTab("insertTextarea", { text: '', isRecording: false, index: getSelectedFormIndex() });
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
