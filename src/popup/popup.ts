import { actionInCurrentTab } from "./util/action-in-current-tab";
import { fillFormSelect } from "./util/fill-form-select";
import { getSelectedFormIndex } from "./util/get-selected-form-index";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");

    document.getElementById("loadFormsButton")?.addEventListener("click", () => {
        actionInCurrentTab("loadForms");
    });

    document.getElementById("autoFillFormButton")?.addEventListener("click", () => {
        actionInCurrentTab("autoFillFormButton", {
            index: getSelectedFormIndex(),
        });
    });

    document.getElementById("takeScreenshotButton")?.addEventListener("click", () => {
        console.log("takeScreenshotButton");
    });

    document.getElementById("useSpeechButton")?.addEventListener("click", () => {
        console.log("useSpeechButton");
    });

    setTimeout(() => {
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
