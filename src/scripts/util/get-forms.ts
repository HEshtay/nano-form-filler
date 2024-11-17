export function getForms(sendMessage: boolean = false) {
    let forms = Array.from(document.querySelectorAll("form"));
    if (sendMessage) {
        const formTitles = forms.map((form) => form.name || form.id);
        chrome.runtime.sendMessage({
            action: "formsLoaded",
            data: {
                titles: formTitles,
            },
        });
    }
    return forms;
}
