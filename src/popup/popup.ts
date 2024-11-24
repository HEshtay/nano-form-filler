import { actionInCurrentTab } from "./util/action-in-current-tab";
import { fillFormSelect } from "./util/fill-form-select";
import { getSelectedFormIndex } from "./util/get-selected-form-index";

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
function initializeMicrophone() {
    const microphoneElement = document.getElementById("microphone");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let current = tabs[0];
        const url = current.url;
        if (url) {
            chrome.contentSettings["microphone"].get(
                {
                    primaryUrl: url,
                },
                function (details) {
                    console.log("Microphone setting for " + url + ": " + details.setting);
                    if (microphoneElement) {
                        (microphoneElement as HTMLSelectElement).disabled = false;
                        (microphoneElement as HTMLSelectElement).value = details.setting;
                    }
                },
            );

            console.log(microphoneElement);
            microphoneElement?.addEventListener("change", function () {
                console.log("Microphone setting changed");
                let setting = (this as HTMLSelectElement).value;
                let pattern = /^file:/.test(url) ? url : url.replace(/\/[^/]*?$/, "/*");
                console.log("Microphone setting for " + pattern + ": " + setting);
                chrome.contentSettings["microphone"].set({
                    primaryPattern: pattern,
                    setting: setting,
                    scope: "regular",
                });
            });
        }
    });
}
