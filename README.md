# Nano Form Filler

## Description

Nano Form Filler is a Chrome Extension that automates form filling on websites using natural language processing. It detects forms on web pages and fills them with provided or randomly generated data. The extension also includes voice recording functionality to transcribe audio input into text for form filling.
> Currently, the Nano Form Filler works only for accessible forms that can be accessed by ID. We are planning to extend the functionality to detect as many forms as possible.

## Goal

The goal of Nano Form Filler is to help QA Engineers and other users to speed up form filling. In a later stage, we plan to add an options page to manage form data and use them for form filling.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Development](#development)
-   [License](#license)
-   [Acknowledgements](#acknowledgements)
-   [Contact](#contact)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/nano-form-filler.git
    ```
2. Navigate to the project directory:
    ```sh
    cd nano-form-filler
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Copy the `src/manifest.json` as `src/manifest.template.json` and add the correct `"trial_tokens": ["<KEY>"]`.
-   To use the prompt API in the extension context, you need to get a trial token. You can do so by following the steps in this documentation: [Chrome Prompt API Documentation](https://developer.chrome.com/docs/extensions/ai/prompt-api)

2. For voice transcription, we are using Groq. You can generate an API Key for free under [Groq Console](https://console.groq.com/keys) and add it to the `background.ts` inside the `apiKey`.
3. Build the project:
    ```sh
    npm run build
    ```
4. Load the extension in Chrome:
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable "Developer mode"
    - Click "Load unpacked" and select the `dist` directory

## Development

1. Start the development server:
    ```sh
    npm run dev
    ```
2. Make changes to the code and see them reflected in real-time.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

-   [Groq SDK](https://github.com/groq/groq-typescript)
-   [Demo QA](https://demoqa.com/automation-practice-form)

## Contact

For questions or feedback, please contact [eshtayhoseen@gmail.com](mailto:eshtayhoseen@gmail.com) or [felix@herold.solutions](mailto:felix@herold.solutions) .
