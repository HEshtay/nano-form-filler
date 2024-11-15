console.log("i am content.ts");

let localForms = [];

function fillForm() {
    console.log("Form filled with one click");
    // load all forms
    const inputs = document.querySelectorAll(["input", "textarea"].join(","));
    console.log("inputs", inputs);
}

function loadForms() {
    let forms = Array.from(document.querySelectorAll("form"));
    localForms = forms;
    console.log(localForms);
    chrome.runtime.sendMessage({
        action: "formsLoaded",
        data: {
            count: localForms.length,
        },
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "autoFillFormButton":
            fillForm();
            break;
        case "loadForms":
            loadForms();
            break;
        default:
            break;
    }
    sendResponse();
    return undefined;
});
