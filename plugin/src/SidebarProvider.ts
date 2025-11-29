import * as vscode from "vscode";
import { Octokit } from "octokit";
import { TelemetryService } from "./TelemetryService";
import { supabase } from "./supabaseClient";

const WORKER_URL = "https://sarvi.hi-codequality.workers.dev/";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;
    private telemetry: TelemetryService;
    private currentUserLogin?: string;
    private currentUserEmail?: string;
    private currentSupabaseUserId?: string;

    constructor(private readonly _extensionUri: vscode.Uri) {
        this.telemetry = new TelemetryService();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        console.log('[TELEMETRY] resolveWebviewView called');
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        console.log('[TELEMETRY] Webview HTML set');

        // Check if already logged in
        this.checkExistingSession(webviewView);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            console.log('[TELEMETRY] Received message from webview:', data.type);
            switch (data.type) {
                case "login": {
                    try {
                        const session = await vscode.authentication.getSession("github", ["repo", "user"], { createIfNone: true });
                        if (session) {
                            // Get user details from GitHub
                            const octokit = new Octokit({ auth: session.accessToken });
                            const { data: user } = await octokit.request('GET /user');
                            const email = await this.resolveGitHubEmail(octokit, user);

                            const userId = await this.lookupOrPromptSignup(email, webviewView);
                            if (!userId) {
                                return;
                            }

                            this.currentUserLogin = user.login;
                            this.currentUserEmail = email;
                            this.currentSupabaseUserId = userId;

                            webviewView.webview.postMessage({
                                type: "loggedIn",
                                user: user.login,
                                avatarUrl: user.avatar_url
                            });
                            vscode.window.showInformationMessage(`Logged in as ${user.login}`);
                        }
                    } catch (e) {
                        webviewView.webview.postMessage({
                            type: "error",
                            message: "Login failed: " + e
                        });
                    }
                    break;
                }

                case "logout": {
                    // Note: VS Code manages GitHub sessions automatically
                    // We just acknowledge the logout on the UI side
                    this.currentSupabaseUserId = undefined;
                    this.currentUserEmail = undefined;
                    vscode.window.showInformationMessage("Logged out from Code Quality");
                    break;
                }

                case "reviewCurrentFile": {
                    await this.reviewCurrentFile(data.model, webviewView);
                    break;
                }

                case "reviewWorkspace": {
                    await this.reviewWorkspace(data.model, webviewView);
                    break;
                }

                case "selectFolder": {
                    await this.selectAndReviewFolder(data.model, webviewView);
                    break;
                }

                case "browseRepos": {
                    await this.browseRepositories(webviewView);
                    break;
                }

                case "selectRepo": {
                    await this.loadBranches(data.repo, webviewView);
                    break;
                }

                case "reviewGitHubRepo": {
                    await this.reviewGitHubRepository(data.repo, data.branch, data.model, webviewView);
                    break;
                }

                case "reviewBranchDiff": {
                    await this.reviewGitHubBranchDiff(
                        data.repo,
                        data.baseBranch,
                        data.compareBranch,
                        data.model,
                        webviewView
                    );
                    break;
                }
            }
        });
    }

    private async checkExistingSession(webviewView: vscode.WebviewView) {
        try {
            const session = await vscode.authentication.getSession("github", ["repo", "user"], { createIfNone: false });
            if (session) {
                // User is already logged in, update UI
                const octokit = new Octokit({ auth: session.accessToken });
                const { data: user } = await octokit.request('GET /user');
                const email = await this.resolveGitHubEmail(octokit, user);
                const userId = await this.lookupOrPromptSignup(email, webviewView);
                if (!userId) {
                    return;
                }

                this.currentUserLogin = user.login;
                this.currentUserEmail = email;
                this.currentSupabaseUserId = userId;

                webviewView.webview.postMessage({
                    type: "loggedIn",
                    user: user.login,
                    avatarUrl: user.avatar_url
                });
            }
        } catch (e) {
            // No existing session, user needs to login
            console.log("No existing GitHub session");
        }
    }

    private async reviewCurrentFile(model: string, webviewView: vscode.WebviewView) {
        try {
            console.log('[TELEMETRY] reviewCurrentFile started, userId:', this.currentSupabaseUserId);
            console.log('reviewCurrentFile called with model:', model);
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                console.log('No active editor found');
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No active file open. Please open a code file first."
                });
                return;
            }

            const document = editor.document;
            const code = document.getText();
            const fileName = document.fileName;
            const language = document.languageId;

            console.log(`Reviewing file: ${fileName}, language: ${language}, length: ${code.length}`);

            const prompt = `You are an expert code reviewer. Review the following ${language} code from file "${fileName}".

Provide a detailed review including:
1. Code quality issues
2. Potential bugs or errors
3. Security concerns
4. Performance improvements
5. Best practices violations
6. Suggestions for improvement

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide a comprehensive review with specific line references where applicable.`;

            const result = await this.callAI(model, prompt, "reviewCurrentFile", {
                fileName,
                language,
                length: code.length,
                model
            });
            console.log('AI review completed, sending result');

            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            console.error('reviewCurrentFile error:', error);
            webviewView.webview.postMessage({
                type: "error",
                message: error.message
            });
        }
    }

    private async reviewWorkspace(model: string, webviewView: vscode.WebviewView) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No workspace folder open. Please open a folder first."
                });
                return;
            }

            // Get all files in workspace
            const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,py,java,go,rs,cpp,c,cs}', '**/node_modules/**', 50);

            if (files.length === 0) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No code files found in workspace"
                });
                return;
            }

            let repoStructure = "Workspace Structure:\n";
            let totalLines = 0;

            for (const file of files.slice(0, 20)) { // Limit to first 20 files
                const doc = await vscode.workspace.openTextDocument(file);
                const lines = doc.lineCount;
                totalLines += lines;
                repoStructure += `- ${vscode.workspace.asRelativePath(file)} (${lines} lines)\n`;
            }

            const prompt = `You are an expert code reviewer. Review this workspace structure and provide insights.

${repoStructure}

Total files analyzed: ${Math.min(files.length, 20)}
Total lines of code: ${totalLines}

Provide:
1. Overall architecture assessment
2. Code organization and structure
3. Potential issues or concerns
4. Recommendations for improvement
5. Best practices that should be followed

Focus on high-level insights rather than line-by-line review.`;

            const result = await this.callAI(model, prompt, "reviewWorkspace", {
                filesAnalyzed: Math.min(files.length, 20),
                totalLines,
                model
            });
            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: error.message
            });
        }
    }

    private async selectAndReviewFolder(model: string, webviewView: vscode.WebviewView) {
        try {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Folder to Review'
            });

            if (!folderUri || folderUri.length === 0) {
                return; // User cancelled
            }

            const selectedFolder = folderUri[0];
            console.log('Selected folder:', selectedFolder.fsPath);

            // Show loading
            webviewView.webview.postMessage({
                type: "status",
                value: "Analyzing folder..."
            });

            // Find all code files in the selected folder
            const pattern = new vscode.RelativePattern(selectedFolder, '**/*.{js,ts,jsx,tsx,py,java,go,rs,cpp,c,cs}');
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 50);

            if (files.length === 0) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No code files found in selected folder"
                });
                return;
            }

            let folderStructure = `Folder: ${selectedFolder.fsPath}\n\nFile Structure:\n`;
            let totalLines = 0;

            for (const file of files.slice(0, 20)) {
                const doc = await vscode.workspace.openTextDocument(file);
                const lines = doc.lineCount;
                totalLines += lines;
                const relativePath = vscode.workspace.asRelativePath(file);
                folderStructure += `- ${relativePath} (${lines} lines)\n`;
            }

            const prompt = `You are an expert code reviewer. Review this folder structure and provide insights.

${folderStructure}

Total files analyzed: ${Math.min(files.length, 20)}
Total lines of code: ${totalLines}

Provide:
1. Overall architecture assessment
2. Code organization and structure
3. Potential issues or concerns
4. Recommendations for improvement
5. Best practices that should be followed

Focus on high-level insights rather than line-by-line review.`;

            const result = await this.callAI(model, prompt, "reviewFolder", {
                folder: selectedFolder.fsPath,
                filesAnalyzed: Math.min(files.length, 20),
                totalLines,
                model
            });
            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            console.error('selectAndReviewFolder error:', error);
            webviewView.webview.postMessage({
                type: "error",
                message: error.message
            });
        }
    }

    private async reviewPullRequest(model: string, webviewView: vscode.WebviewView) {
        try {
            // Get git extension first
            const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
            const api = gitExtension?.getAPI(1);
            const repo = api?.repositories[0];

            if (!repo) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No git repository found in workspace. Please open a folder with a git repository."
                });
                return;
            }

            // Get current branch
            const currentBranch = repo.state.HEAD?.name;
            if (!currentBranch) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "Could not determine current branch"
                });
                return;
            }

            // Get diff
            const diff = await repo.diff(true);

            if (!diff || diff.trim().length === 0) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "No changes found in current branch. Make some changes first or switch to a branch with changes."
                });
                return;
            }

            const prompt = `You are an expert code reviewer. Review the following git diff for a pull request.

Branch: ${currentBranch}

Changes:
\`\`\`diff
${diff}
\`\`\`

Provide a detailed PR review including:
1. Summary of changes
2. Code quality assessment
3. Potential bugs or issues
4. Security concerns
5. Performance implications
6. Suggestions for improvement
7. Overall recommendation (Approve/Request Changes/Comment)

Be thorough but concise.`;

            const result = await this.callAI(model, prompt);
            await this.logReviewEvent("reviewPullRequest", {
                branch: currentBranch,
                model
            }, result);
            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: error.message
            });
        }
    }

    private async browseRepositories(webviewView: vscode.WebviewView) {
        try {
            const session = await vscode.authentication.getSession("github", ["repo", "user"], { createIfNone: true });
            if (!session) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "Please login to GitHub first"
                });
                return;
            }

            const octokit = new Octokit({ auth: session.accessToken });
            const { data: repos } = await octokit.request('GET /user/repos', {
                sort: 'updated',
                per_page: 100
            });

            webviewView.webview.postMessage({
                type: "repositories",
                repos: repos
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: `Failed to load repositories: ${error.message}`
            });
        }
    }

    private async loadBranches(repoFullName: string, webviewView: vscode.WebviewView) {
        try {
            const session = await vscode.authentication.getSession("github", ["repo"], { createIfNone: true });
            if (!session) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "Please login to GitHub first"
                });
                return;
            }

            const [owner, repo] = repoFullName.split('/');
            const octokit = new Octokit({ auth: session.accessToken });
            const { data: branches } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
                owner,
                repo
            });

            webviewView.webview.postMessage({
                type: "branches",
                branches: branches,
                repo: repoFullName
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: `Failed to load branches: ${error.message}`
            });
        }
    }

    private async reviewGitHubRepository(repoFullName: string, branch: string, model: string, webviewView: vscode.WebviewView) {
        try {
            const session = await vscode.authentication.getSession("github", ["repo"], { createIfNone: true });
            if (!session) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "Please login to GitHub first"
                });
                return;
            }

            const [owner, repo] = repoFullName.split('/');
            const octokit = new Octokit({ auth: session.accessToken });

            // Get repository contents
            const { data: contents } = await octokit.request('GET /repos/{owner}/{repo}/contents', {
                owner,
                repo,
                ref: branch
            });

            // Build file tree
            let fileTree = `Repository: ${repoFullName}\nBranch: ${branch}\n\nFile Structure:\n`;
            const files = Array.isArray(contents) ? contents : [contents];
            files.forEach((file: any) => {
                fileTree += `- ${file.name} (${file.type})\n`;
            });

            const prompt = `You are an expert code reviewer. Review this GitHub repository.

${fileTree}

Provide:
1. Repository structure analysis
2. Code organization assessment
3. Potential issues or concerns
4. Best practices recommendations
5. Security considerations
6. Suggestions for improvement

Focus on high-level architecture and patterns.`;

            const result = await this.callAI(model, prompt, "reviewGitHubRepo", {
                repo: repoFullName,
                branch,
                model
            });
            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: `Failed to review repository: ${error.message}`
            });
        }
    }

    private async reviewGitHubBranchDiff(
        repoFullName: string,
        baseBranch: string,
        compareBranch: string,
        model: string,
        webviewView: vscode.WebviewView
    ) {
        try {
            const session = await vscode.authentication.getSession("github", ["repo"], { createIfNone: true });
            if (!session) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: "Please login to GitHub first"
                });
                return;
            }

            const [owner, repo] = repoFullName.split('/');
            const octokit = new Octokit({ auth: session.accessToken });

            const { data: comparison } = await octokit.request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
                owner,
                repo,
                base: baseBranch,
                head: compareBranch
            });

            if (!comparison.files || comparison.files.length === 0) {
                webviewView.webview.postMessage({
                    type: "error",
                    message: `No differences found between ${baseBranch} and ${compareBranch}`
                });
                return;
            }

            const maxFiles = 20;
            let fileDiffs = "";
            comparison.files.slice(0, maxFiles).forEach((file: any) => {
                let patch = file.patch ?? "[Binary or unsupported diff omitted]";
                if (patch.length > 4000) {
                    patch = `${patch.slice(0, 4000)}\n[Diff truncated for brevity]`;
                }
                fileDiffs += `File: ${file.filename}\nStatus: ${file.status} ( +${file.additions} / -${file.deletions} )\nDiff:\n${patch}\n\n`;
            });

            if (comparison.files.length > maxFiles) {
                fileDiffs += `[Only the first ${maxFiles} changed files are shown. ${comparison.files.length - maxFiles} additional files omitted.]\n`;
            }

            const commitsSummary = (comparison.commits || [])
                .map((commit: any) => `- ${commit.sha.substring(0, 7)} ${commit.commit.message.split('\n')[0]} (${commit.commit.author?.name || 'Unknown'})`)
                .join('\n') || 'No commits information available';

            const prompt = `You are an expert reviewer. Analyze the pull-request style diff between two branches.\n\nRepository: ${repoFullName}\nBase Branch: ${baseBranch}\nCompare Branch: ${compareBranch}\nAhead by: ${comparison.ahead_by} commits\nBehind by: ${comparison.behind_by} commits\nTotal commits in diff: ${comparison.total_commits}\n\nRecent commits:\n${commitsSummary}\n\nChanged files (limited to ${maxFiles}):\n\n\`\`\`diff\n${fileDiffs}\n\`\`\`\n\nProvide a PR-style review covering:\n1. Summary of changes\n2. Code quality concerns\n3. Potential bugs or regressions\n4. Security or performance risks\n5. Test considerations\n6. Actionable recommendations with severity\n7. Overall verdict (Approve/Request Changes/Comment)`;

            const result = await this.callAI(model, prompt, "reviewBranchDiff", {
                repo: repoFullName,
                baseBranch,
                compareBranch,
                filesChanged: comparison.files.length,
                totalCommits: comparison.total_commits,
                model
            });
            webviewView.webview.postMessage({
                type: "reviewResult",
                result
            });

        } catch (error: any) {
            webviewView.webview.postMessage({
                type: "error",
                message: `Failed to compare branches: ${error.message}`
            });
        }
    }

    private async callAI(model: string, prompt: string, eventType?: string, eventPayload?: Record<string, any>): Promise<string> {
        try {
            console.log('[TELEMETRY] callAI: Sending telemetry data:', {
                userEmail: this.currentUserEmail,
                userId: this.currentSupabaseUserId,
                eventType,
                eventPayload
            });
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                    // Pass user metadata for telemetry
                    telemetry: {
                        userEmail: this.currentUserEmail,
                        userId: this.currentSupabaseUserId,
                        eventType: eventType || 'review',
                        eventPayload: eventPayload || {}
                    }
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`AI API Error (${response.status}): ${error}`);
            }

            const data = await response.json();
            console.log('AI Response:', JSON.stringify(data, null, 2)); // Debug log

            // Handle different response formats
            // Format 1: Direct message.content
            if (data.message?.content) {
                return data.message.content;
            }

            // Format 2: Success wrapper with nested candidates (Gemini via worker)
            if (data.success && data.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.data.candidates[0].content.parts[0].text;
            }

            // Format 3: Success wrapper with nested choices (OpenAI via worker)
            if (data.success && data.data?.choices?.[0]?.message?.content) {
                return data.data.choices[0].message.content;
            }

            // Format 4: Direct Google Gemini format
            if (data.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.data.candidates[0].content.parts[0].text;
            }

            // Format 5: Direct OpenAI/OpenRouter format
            if (data.data?.choices?.[0]?.message?.content) {
                return data.data.choices[0].message.content;
            }

            // Format 6: Direct choices array
            if (data.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }

            // Format 7: Success with string data
            if (data.success && typeof data.data === 'string') {
                return data.data;
            }

            // Format 8: Candidates array directly
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            // Check if response was truncated or has issues
            if (data.success && data.data?.candidates?.[0]) {
                const candidate = data.data.candidates[0];

                // Check finish reason
                if (candidate.finishReason === 'MAX_TOKENS') {
                    // Try to get partial content if available
                    const partialText = candidate.content?.parts?.[0]?.text;
                    if (partialText) {
                        return partialText + '\n\n[Note: Response was truncated due to length. Consider reviewing smaller files or increasing max_tokens.]';
                    }
                    throw new Error('Response was truncated (MAX_TOKENS). Try reviewing a smaller file or folder.');
                }

                // Check if content exists but is malformed
                if (candidate.content && !candidate.content.parts) {
                    throw new Error('AI returned incomplete response. Please try again.');
                }
            }

            // Log the actual response for debugging
            console.error('Unexpected AI response format:', data);
            throw new Error(`Unexpected response format. Response: ${JSON.stringify(data).substring(0, 200)}`);

        } catch (error: any) {
            console.error('AI Call Error:', error);
            throw new Error(`Failed to get AI review: ${error.message}`);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "style.css")
        );

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Code Quality</title>
			</head>
			<body>
                <div class="container">
                    <!-- Auth Section -->
                    <div id="auth-section" class="section">
                        <h1>Code Quality</h1>
                        <p>AI-powered code review assistant. Login to GitHub to get started.</p>
                        <button id="login-btn">Login with GitHub</button>
                    </div>

                    <!-- Main Menu -->
                    <div id="main-menu" class="section hidden">
                        <!-- User Profile -->
                        <div class="user-profile">
                            <img id="user-avatar" class="user-avatar" src="" alt="User Avatar">
                            <div class="user-info">
                                <p id="user-name" class="user-name">User</p>
                                <p id="user-status" class="user-status">Disconnected</p>
                            </div>
                            <button id="profile-menu-btn" class="profile-menu-btn">⋮</button>
                            <div id="profile-dropdown" class="profile-dropdown hidden">
                                <button id="logout-btn">Logout</button>
                            </div>
                        </div>

                        <!-- Model Selector -->
                        <div class="model-selector">
                            <label for="model-select">AI Model</label>
                            <select id="model-select">
                                <!-- Options populated by JavaScript -->
                            </select>
                        </div>

                        <h2>GitHub Repositories</h2>
                        
                        <div class="card" id="browse-repos-btn">
                            <h3>🔍 Browse My Repos</h3>
                            <p>Select a repository and branch to review</p>
                        </div>

                        <h2>Local Review Options</h2>
                        
                        <div class="card" id="review-project-btn">
                            <h3>📂 Review Project</h3>
                            <p>Select files or folders to review from your workspace</p>
                        </div>
                    </div>

                    <!-- Review Selection Section -->
                    <div id="review-selection" class="section hidden">
                        <h2>Select What to Review</h2>
                        
                        <div class="selection-options">
                            <button id="select-current-file-btn" class="selection-btn">
                                📄 Current File
                            </button>
                            <button id="select-folder-btn" class="selection-btn">
                                📁 Select Folder
                            </button>
                            <button id="select-all-btn" class="selection-btn">
                                🗂️ Entire Workspace
                            </button>
                        </div>

                        <div id="file-tree-container" class="hidden">
                            <h3>Select Files/Folders:</h3>
                            <div id="file-tree"></div>
                            <button id="review-selected-btn">Review Selected</button>
                        </div>

                        <button class="back-btn">Back to Menu</button>
                    </div>

                    <!-- Loading State -->
                    <div id="loading" class="loading hidden">
                        <div class="spinner"></div>
                        <span id="loading-text">Analyzing...</span>
                    </div>

                    <!-- Results Section -->
                    <div id="results-section" class="section hidden">
                        <div id="results-content"></div>
                        <button class="back-btn">Back to Menu</button>
                    </div>
                </div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
    }

    private async logReviewEvent(eventType: string, payload: Record<string, any>, result?: string) {
        console.log('[TELEMETRY] logReviewEvent called:', eventType, 'currentSupabaseUserId:', this.currentSupabaseUserId, 'currentUserEmail:', this.currentUserEmail);
        
        if (!this.currentSupabaseUserId && this.currentUserEmail && this._view) {
            console.log('[TELEMETRY] Attempting to refresh Supabase ID for email:', this.currentUserEmail);
            const refreshedId = await this.lookupOrPromptSignup(this.currentUserEmail, this._view);
            if (refreshedId) {
                console.log('[TELEMETRY] Refreshed Supabase ID:', refreshedId);
                this.currentSupabaseUserId = refreshedId;
            } else {
                console.log('[TELEMETRY] Failed to refresh Supabase ID');
            }
        }

        const userId = this.currentSupabaseUserId;
        if (!userId) {
            console.warn("[TELEMETRY] Telemetry skipped: Supabase user id is not set");
            return;
        }

        console.log('[TELEMETRY] Recording event with userId:', userId);
        await this.telemetry.recordReviewEvent(
            userId,
            eventType,
            payload,
            result
        );
        console.log('[TELEMETRY] Event recorded successfully');
    }

    private async resolveGitHubEmail(octokit: Octokit, user: any): Promise<string | undefined> {
        if (user.email) {
            return user.email;
        }

        try {
            const { data: emails } = await octokit.request('GET /user/emails');
            const primary = emails.find((item: any) => item.primary && item.verified) || emails.find((item: any) => item.verified);
            return primary?.email;
        } catch (error) {
            console.warn('Failed to fetch GitHub emails', error);
            return undefined;
        }
    }

    private async lookupOrPromptSignup(email: string | undefined, webviewView: vscode.WebviewView): Promise<string | undefined> {
        if (!email) {
            webviewView.webview.postMessage({
                type: "error",
                message: "Unable to determine your GitHub email. Please make sure your email is public or verified on GitHub."
            });
            return undefined;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", email)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (data?.id) {
                return data.id;
            }

            const message = `No Code Quality account found for ${email}. Please sign up to continue.`;
            webviewView.webview.postMessage({
                type: "error",
                message
            });

            const openLabel = "Open Signup";
            const result = await vscode.window.showWarningMessage(message, openLabel, "Dismiss");
            if (result === openLabel) {
                vscode.env.openExternal(vscode.Uri.parse("https://getcq.netlify.app/signup"));
            }
            return undefined;

        } catch (error: any) {
            console.error('Supabase profile lookup error', error);
            webviewView.webview.postMessage({
                type: "error",
                message: `Failed to verify account: ${error.message}`
            });
            return undefined;
        }
    }
}
