function actionInCurrentTab(action: string): void {
    console.log(action);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        if (tabId == null) {
            return;
        }
        chrome.tabs.sendMessage(tabId, { action }, {}, (response) => {
            console.log("actionresponse:", response);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");

    document.getElementById("autoFillFormButton")?.addEventListener("click", () => {
        console.log("autoFillFormButton");
        actionInCurrentTab("autoFillFormButton");
    });

    document.getElementById("takeScreenshotButton")?.addEventListener("click", () => {
        console.log("takeScreenshotButton");
    });

    document.getElementById("useSpeechButton")?.addEventListener("click", () => {
        console.log("useSpeechButton");
    });
});
