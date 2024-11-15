
console.log("i am content.ts");
// content.js
function fillForm() {
    console.log("Form filled with one click");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autoFillFormButton") {
        fillForm();
    }
    sendResponse();
    return undefined;
});
