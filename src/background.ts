import Groq from "groq-sdk";

// Initialize the Groq client
const groq = new Groq({ apiKey: "" });

function base64ToBlob(base64String: string, mimeType: string): Blob {
    // Decode the base64 string to binary data
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    // Convert each character to its corresponding byte
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Create a typed array (Uint8Array) from byte numbers
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
    return blob;
}

// Main transcription function
const transcribe = async (): Promise<string> => {
    // get audio data from chrome storage
    const arrayBuffer = await chrome.storage.local.get(["audioBlob"]);
    const audioMimeType = await chrome.storage.local.get(["audioMimeType"]);
    const base64Data = arrayBuffer.audioBlob.split(",")[1]; // Removes the data URL prefix

    // convert base64 to blob
    const audioBlob = base64ToBlob(base64Data, audioMimeType.audioMimeType);

    // Convert ArrayBuffer to File with proper MIME type
    const extension = audioMimeType.audioMimeType.split("/")[1];

    const audioFile = new File([audioBlob], `audio.${extension}`, {
        lastModified: Date.now(),
        type: extension,
    });

    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        response_format: "json",
        temperature: 0.0,
    });

    return transcription.text;
};

// Chrome extension message handler
chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse: (respoonse: { success: boolean; text?: string; error?: string }) => void,
    ) => {
        (async function () {
            try {
                let result;
                if (message.action === "transcribe") {
                    console.log("Transcribing audio data", message);
                    result = await transcribe();
                    sendResponse({ success: true, text: result });
                } else {
                    throw new Error(`Unknown action: ${message.action}`);
                }
            } catch (error: any) {
                console.error("Error processing message:", error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Will respond asynchronously
    },
);
