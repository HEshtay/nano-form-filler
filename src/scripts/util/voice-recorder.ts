interface VoiceRecordingState {
    isRecording: boolean;
    mediaRecorder: MediaRecorder | null;
    audioChunks: Blob[];
}

export class VoiceRecorder {
    private readonly state: VoiceRecordingState;
    constructor() {
        this.state = {
            isRecording: false,
            mediaRecorder: null,
            audioChunks: [],
        };
    }

    async startRecording(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.state.mediaRecorder = new MediaRecorder(stream);
            this.state.audioChunks = [];
            this.state.isRecording = true;
            await chrome.storage.local.set({ isRecording: true });

            this.state.mediaRecorder.start();
            this.state.mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    this.state.audioChunks.push(event.data);
                }
            };
        } catch (error) {
            console.error("Error starting recording:", error);
            throw error;
        }
    }

    async stopRecording(): Promise<{ blob: Blob; mimeType: string }> {
        return new Promise((resolve, reject) => {
            if (!this.state.mediaRecorder) {
                reject(new Error("No recording in progress"));
                return;
            }

            this.state.mediaRecorder.onstop = async () => {
                try {
                    // Use the actual MIME type from the recorder
                    const actualMimeType = "audio/mp4";
                    const audioBlob = new Blob(this.state.audioChunks, { type: actualMimeType });
                    this.state.isRecording = false;
                    await chrome.storage.local.set({ isRecording: false });

                    // Stop all audio tracks
                    const tracks = this.state.mediaRecorder?.stream.getTracks();
                    tracks?.forEach((track) => track.stop());

                    resolve({
                        blob: audioBlob,
                        mimeType: actualMimeType,
                    });
                } catch (error) {
                    reject(error);
                }
            };

            this.state.mediaRecorder.stop();
        });
    }
}
