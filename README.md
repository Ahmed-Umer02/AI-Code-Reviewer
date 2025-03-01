# AI Code Reviewer

AI Code Reviewer is a GitHub App that provides automated code reviews using AI, powered by Code Llama. It integrates with GitHub's Pull Request system and analyzes code changes to provide feedback.

## Features
- Automated code reviews on pull requests.
- AI-powered code analysis via Code Llama.
- Easy GitHub App integration.

## Setup

### Prerequisites
- Node.js
- GitHub App (Create one through GitHub’s Developer settings)
- Code Llama API key (if you're using the Code Llama service)

### Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/AI-Code-Reviewer.git
    cd AI-Code-Reviewer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following (replace with your actual values):
    ```env
    GITHUB_APP_ID=your-github-app-id
    GITHUB_PRIVATE_KEY="your-private-key-content"
    GITHUB_WEBHOOK_SECRET=your-webhook-secret
    HF_TOKEN=your-code-llama-api-key
    CLIENT_ID=your-github-oauth-client-id
    CLIENT_SECRET=your-github-oauth-client-secret
    PORT=3000
    ```

4. Run the application:
    ```bash
    npm start
    ```

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

