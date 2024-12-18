import { fillForm } from "./fill-form";
import { VoiceRecorder } from "./voice-recorder";

const recorder = new VoiceRecorder();

export async function handleStartRecording(
    sendResponse: (response: { success: boolean; error?: string }) => void,
) {
    try {
        await recorder.startRecording();
        sendResponse({ success: true });
    } catch (error) {
        console.error("Error starting recording:", error);
        sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error starting recording",
        });
    }
}
export async function insertTextarea(
    text: string,
    formIndex?: number,
    isRecording: boolean = false,
) {
    let sidebar = document.getElementById("voice-transcriber-sidebar");
    if (sidebar) {
        const textarea = sidebar.querySelector("textarea");
        const startStopButton = sidebar.querySelector("#startStopButton") as HTMLButtonElement;
        if (textarea) {
            textarea.value = text;
        }
        if (startStopButton) {
            startStopButton.textContent = isRecording ? "Stop Listening" : "Start Listening";
            startStopButton.classList.toggle("recording", isRecording);
            setTimeout(() => {
                startStopButton.style.animation = isRecording ? "pulse-shadow 1s infinite" : "";
            }, 100);
        }
        sidebar.style.transform = "translateX(0)";
        return;
    }

    sidebar = document.createElement("div");
    sidebar.id = "voice-transcriber-sidebar";
    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "0";
    sidebar.style.width = "300px";
    sidebar.style.height = "100%";
    sidebar.style.backgroundColor = "#fff";
    sidebar.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    sidebar.style.padding = "20px";
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    sidebar.style.transition = "transform 0.3s ease";
    sidebar.style.transform = "translateX(0)";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "⇔";
    toggleButton.style.position = "absolute";
    toggleButton.style.top = "10px";
    toggleButton.style.left = "-30px";
    toggleButton.style.width = "30px";
    toggleButton.style.height = "30px";
    toggleButton.style.backgroundColor = "#000";
    toggleButton.style.color = "#fff";
    toggleButton.style.border = "none";
    toggleButton.style.cursor = "pointer";
    sidebar.appendChild(toggleButton);

    toggleButton.addEventListener("click", () => {
        if (sidebar.style.transform === "translateX(0px)") {
            sidebar.style.transform = "translateX(100%)";
        } else {
            sidebar.style.transform = "translateX(0px)";
        }
    });

    const header = document.createElement("h2");
    header.textContent = "Voice Transcriber";
    header.style.marginBottom = "20px";
    sidebar.appendChild(header);

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Your transcription will appear here...";
    textarea.value = text;
    textarea.style.flex = "1";
    textarea.style.resize = "none";
    textarea.style.width = "100%";
    textarea.style.marginBottom = "10px";
    textarea.style.padding = "10px";
    textarea.style.fontSize = "16px";
    sidebar.appendChild(textarea);

    const startButton = document.createElement("button");
    startButton.textContent = isRecording ? "Stop Listening" : "Start Listening";
    startButton.classList.toggle("recording", isRecording);
    startButton.id = "startStopButton";
    startButton.style.width = "100%";
    startButton.style.padding = "10px";
    startButton.style.backgroundColor = "#000";
    startButton.style.color = "#fff";
    startButton.style.border = "none";
    startButton.style.cursor = "pointer";
    startButton.style.marginBottom = "10px";
    startButton.style.position = "relative";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.style.position = "absolute";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.border = "4px solid #f3f3f3";
    loadingIndicator.style.borderTop = "4px solid #3498db";
    loadingIndicator.style.borderRadius = "50%";
    loadingIndicator.style.width = "20px";
    loadingIndicator.style.height = "20px";
    loadingIndicator.style.animation = "spin 2s linear infinite";
    loadingIndicator.style.display = "none";
    startButton.appendChild(loadingIndicator);
    sidebar.appendChild(startButton);

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.style.width = "100%";
    clearButton.style.padding = "10px";
    clearButton.style.backgroundColor = "#fff";
    clearButton.style.color = "#000";
    clearButton.style.border = "1px solid #000";
    clearButton.style.cursor = "pointer";
    sidebar.appendChild(clearButton);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.style.width = "100%";
    submitButton.style.padding = "10px";
    submitButton.style.backgroundColor = "#4CAF50";
    submitButton.style.color = "#fff";
    submitButton.style.border = "none";
    submitButton.style.cursor = "pointer";
    sidebar.appendChild(submitButton);

    clearButton.addEventListener("click", () => {
        textarea.value = "";
    });

    submitButton.addEventListener("click", () => {
        console.log("Submitted text:", textarea.value);
        fillForm(formIndex ?? 0, textarea.value);
    });

    startButton.addEventListener("click", async () => {
        const isRecordingStorage = (await chrome.storage.local.get("isRecording")) || {
            isRecording,
        };
        console.log("isRecordingStorage", isRecordingStorage);
        if (isRecordingStorage.isRecording) {
            loadingIndicator.style.display = "block";
            await handleStopRecording(() => {
                loadingIndicator.style.display = "none";
                startButton.style.animation = ""; // Remove pulse-shadow animation
            });
            startButton.textContent = "Start Listening";
            startButton.classList.remove("recording");
            await chrome.storage.local.set({ isRecording: false });
        } else {
            await handleStartRecording(() => {});
            startButton.textContent = "Stop Listening";
            startButton.classList.add("recording");
            startButton.style.animation = "pulse-shadow 1s infinite";
            await chrome.storage.local.set({ isRecording: true });
        }
    });

    document.body.appendChild(sidebar);
}

export async function handleStopRecording(
    sendResponse: (response: { success: boolean; error?: string }) => void,
) {
    try {
        console.log("stopRecording");
        const { blob, mimeType } = await recorder.stopRecording();
        // convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = reader.result;
            await chrome.storage.local.set({
                audioBlob: base64data,
                audioMimeType: mimeType,
            });
        };

        // Send to background script for transcription
        chrome.runtime
            .sendMessage({
                action: "transcribe",
            })
            .then((response) => {
                console.log("Transcription response:", response);
                insertTextarea(response.text);
            });

        sendResponse({ success: true });
    } catch (error) {
        console.error("Error stopping recording:", error);
        sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error stopping recording",
        });
    }
}
