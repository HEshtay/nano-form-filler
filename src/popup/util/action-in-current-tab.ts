export function actionInCurrentTab(action: string, data: Record<string, unknown> = {}): void {
    console.log(action);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        if (tabId == null) {
            return;
        }
        chrome.tabs.sendMessage(tabId, { action, data });
    });
}
