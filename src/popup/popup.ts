document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");

    document.getElementById("autoFillFormButton")?.addEventListener("click", () => {
        console.log("autoFillFormButton");
    });

    document.getElementById("takeScreenshotButton")?.addEventListener("click", () => {
        console.log("takeScreenshotButton");
    });

    document.getElementById("useSpeechButton")?.addEventListener("click", () => {
        console.log("useSpeechButton");
    });
});
