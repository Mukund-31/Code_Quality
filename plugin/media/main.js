const vscode = acquireVsCodeApi();

// Available models from worker.js
const MODELS = {
    'gpt-oss-20b': 'GPT OSS 20B',
    'kat-coder-pro': 'Kat Coder Pro',
    'kimi-k2': 'Kimi K2',
    'deepseek-v3.1': 'DeepSeek v3.1',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-2.5-pro': 'Gemini 2.5 Pro'
};

let isLoggedIn = false;

window.addEventListener('load', () => {
    const loginBtn = document.getElementById('login-btn');
    const profileMenuBtn = document.getElementById('profile-menu-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const browseReposBtn = document.getElementById('browse-repos-btn');
    const reviewProjectBtn = document.getElementById('review-project-btn');
    const selectCurrentFileBtn = document.getElementById('select-current-file-btn');
    const selectFolderBtn = document.getElementById('select-folder-btn');
    const selectAllBtn = document.getElementById('select-all-btn');
    const modelSelect = document.getElementById('model-select');
    const backBtns = document.querySelectorAll('.back-btn');

    // Initialize UI state
    const loadingEl = document.getElementById('loading');
    const authSection = document.getElementById('auth-section');
    const mainMenu = document.getElementById('main-menu');
    const resultsSection = document.getElementById('results-section');
    const reviewSelection = document.getElementById('review-selection');

    // Ensure correct initial state
    if (loadingEl) loadingEl.classList.add('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');
    if (reviewSelection) reviewSelection.classList.add('hidden');

    // Start with auth section visible, main menu hidden
    // (unless we get a loggedIn message from the backend)
    if (authSection) authSection.classList.remove('hidden');
    if (mainMenu) mainMenu.classList.add('hidden');

    // Populate model selector
    if (modelSelect) {
        Object.entries(MODELS).forEach(([key, label]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            modelSelect.appendChild(option);
        });
        // Set default model
        modelSelect.value = 'deepseek-v3.1';
    }

    // Disable review buttons initially
    setReviewButtonsState(false);

    // Profile dropdown toggle
    profileMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown?.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        profileDropdown?.classList.add('hidden');
    });

    // Prevent dropdown from closing when clicking inside it
    profileDropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // State handlers
    loginBtn?.addEventListener('click', () => {
        vscode.postMessage({ type: 'login' });
    });

    logoutBtn?.addEventListener('click', () => {
        vscode.postMessage({ type: 'logout' });
        isLoggedIn = false;
        setReviewButtonsState(false);
        profileDropdown?.classList.add('hidden');
        showSection('auth-section');
    });

    browseReposBtn?.addEventListener('click', () => {
        if (!isLoggedIn) {
            return;
        }
        vscode.postMessage({ type: 'browseRepos' });
        showLoading('Loading your repositories...');
    });

    reviewProjectBtn?.addEventListener('click', () => {
        if (!isLoggedIn) {
            return;
        }
        showSection('review-selection');
    });

    selectCurrentFileBtn?.addEventListener('click', () => {
        const model = modelSelect?.value || 'deepseek-v3.1';
        vscode.postMessage({ type: 'reviewCurrentFile', model });
        showLoading('Analyzing current file...');
    });

    selectFolderBtn?.addEventListener('click', () => {
        const model = modelSelect?.value || 'deepseek-v3.1';
        vscode.postMessage({ type: 'selectFolder', model });
    });

    selectAllBtn?.addEventListener('click', () => {
        const model = modelSelect?.value || 'deepseek-v3.1';
        vscode.postMessage({ type: 'reviewWorkspace', model });
        showLoading('Analyzing entire workspace...');
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideLoading();
            showSection('main-menu');
        });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'loggedIn':
                isLoggedIn = true;
                setReviewButtonsState(true);
                document.getElementById('auth-section').classList.add('hidden');
                document.getElementById('main-menu').classList.remove('hidden');

                // Update user profile
                const userAvatar = document.getElementById('user-avatar');
                const userName = document.getElementById('user-name');
                const userStatus = document.getElementById('user-status');

                if (userAvatar && message.avatarUrl) {
                    userAvatar.src = message.avatarUrl;
                }
                if (userName && message.user) {
                    userName.textContent = message.user;
                }
                if (userStatus) {
                    userStatus.textContent = 'Connected';
                }
                break;

            case 'repositories':
                hideLoading();
                showRepositories(message.repos);
                break;

            case 'branches':
                showBranches(message.branches, message.repo);
                break;

            case 'reviewResult':
                hideLoading();
                showReviewResult(message.result);
                break;

            case 'error':
                hideLoading();
                showError(message.message);
                break;

            case 'status':
                console.log(message.value);
                break;
        }
    });
});

function setReviewButtonsState(enabled) {
    const browseReposBtn = document.getElementById('browse-repos-btn');
    const reviewProjectBtn = document.getElementById('review-project-btn');

    if (enabled) {
        browseReposBtn?.classList.remove('disabled');
        reviewProjectBtn?.classList.remove('disabled');
    } else {
        browseReposBtn?.classList.add('disabled');
        reviewProjectBtn?.classList.add('disabled');
    }
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    document.getElementById(id)?.classList.remove('hidden');
}

function showLoading(message) {
    const loadingEl = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingEl && loadingText) {
        loadingText.textContent = message;
        loadingEl.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.classList.add('hidden');
    }
}

function showReviewResult(result) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');

    if (resultsSection && resultsContent) {
        resultsContent.innerHTML = formatReviewResult(result);
        showSection('results-section');
    }
}

function formatReviewResult(result) {
    return `
        <div class="review-result">
            <h3>Code Review Results</h3>
            <div class="review-content">${escapeHtml(result)}</div>
        </div>
    `;
}

function showError(message) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');

    if (resultsSection && resultsContent) {
        resultsContent.innerHTML = `
            <div class="review-result" style="border-left-color: var(--vscode-errorForeground);">
                <h3>Error</h3>
                <div class="review-content">${escapeHtml(message)}</div>
            </div>
        `;
        showSection('results-section');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showRepositories(repos) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');

    if (!resultsSection || !resultsContent) return;

    let html = `
        <div class="review-result">
            <h3>Your GitHub Repositories (${repos.length})</h3>
            <div class="repo-list">
    `;

    repos.forEach(repo => {
        html += `
            <div class="repo-item" data-repo="${escapeHtml(repo.full_name)}">
                <h4>${escapeHtml(repo.name)}</h4>
                <p>${escapeHtml(repo.description || 'No description')}</p>
                <div class="repo-meta">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>${repo.language || 'Unknown'}</span>
                    <span>${repo.private ? '🔒 Private' : '🌐 Public'}</span>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    resultsContent.innerHTML = html;
    showSection('results-section');

    // Add click handlers to repo items
    document.querySelectorAll('.repo-item').forEach(item => {
        item.addEventListener('click', () => {
            const repoFullName = item.getAttribute('data-repo');
            vscode.postMessage({ type: 'selectRepo', repo: repoFullName });
            showLoading('Loading branches...');
        });
    });
}

function showBranches(branches, repoFullName) {
    hideLoading();
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');

    if (!resultsSection || !resultsContent) return;

    const defaultBranch = branches.find(branch => branch.name === 'main' || branch.name === 'master')?.name || branches[0]?.name || '';

    let html = `
        <div class="review-result">
            <h3>Review Branch or Compare Branches</h3>
            <p>Repository: <strong>${escapeHtml(repoFullName)}</strong></p>
            
            <div class="branch-selector">
                <label for="single-branch-select">Branch to summarize:</label>
                <select id="single-branch-select">
    `;

    branches.forEach(branch => {
        const selected = branch.name === defaultBranch ? 'selected' : '';
        html += `<option value="${escapeHtml(branch.name)}" ${selected}>${escapeHtml(branch.name)}</option>`;
    });

    html += `
                </select>
                <button id="start-branch-review-btn">Review Branch</button>
            </div>

            <div class="branch-selector">
                <label for="base-branch-select">Base branch:</label>
                <select id="base-branch-select">
    `;

    branches.forEach(branch => {
        const selected = branch.name === defaultBranch ? 'selected' : '';
        html += `<option value="${escapeHtml(branch.name)}" ${selected}>${escapeHtml(branch.name)}</option>`;
    });

    html += `
                </select>
            </div>

            <div class="branch-selector">
                <label for="compare-branch-select">Compare branch:</label>
                <select id="compare-branch-select">
    `;

    branches.forEach(branch => {
        const selected = branch.name !== defaultBranch ? 'selected' : '';
        html += `<option value="${escapeHtml(branch.name)}" ${selected}>${escapeHtml(branch.name)}</option>`;
    });

    html += `
                </select>
                <button id="start-branch-diff-btn">Review Branch Diff</button>
            </div>
        </div>
    `;

    resultsContent.innerHTML = html;

    const modelSelect = document.getElementById('model-select');

    document.getElementById('start-branch-review-btn')?.addEventListener('click', () => {
        const branch = document.getElementById('single-branch-select')?.value;
        const model = modelSelect?.value || 'deepseek-v3.1';

        vscode.postMessage({
            type: 'reviewGitHubRepo',
            repo: repoFullName,
            branch,
            model
        });
        showLoading(`Reviewing ${repoFullName} (${branch})...`);
    });

    document.getElementById('start-branch-diff-btn')?.addEventListener('click', () => {
        const baseBranch = document.getElementById('base-branch-select')?.value;
        const compareBranch = document.getElementById('compare-branch-select')?.value;
        const model = modelSelect?.value || 'deepseek-v3.1';

        if (!baseBranch || !compareBranch) {
            showError('Please select both base and compare branches.');
            return;
        }

        if (baseBranch === compareBranch) {
            showError('Base and compare branches must be different to review a diff.');
            return;
        }

        vscode.postMessage({
            type: 'reviewBranchDiff',
            repo: repoFullName,
            baseBranch,
            compareBranch,
            model
        });
        showLoading(`Reviewing diff: ${compareBranch} → ${baseBranch}...`);
    });
}
