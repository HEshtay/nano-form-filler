export function initializeMicrophone() {
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
