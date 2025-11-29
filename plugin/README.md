# Code Quality - AI Code Review Assistant

A powerful VS Code extension that provides AI-powered code reviews similar to CodeRabbit, with GitHub integration and multiple AI model support.

## 🚀 Features

### 🤖 AI-Powered Code Review
- **Review Current File**: Get detailed analysis of your open file including code quality, bugs, security issues, and improvement suggestions
- **Review Folder**: Select any folder on your system to analyze
- **Review Workspace**: Analyze your entire workspace structure and get architectural insights
- **Review GitHub Repositories**: Browse and review your GitHub repos directly without cloning

### 🎯 Multiple AI Models
Choose from various AI models powered by your Cloudflare Worker:
- **DeepSeek v3.1** (Default)
- **GPT OSS 20B**
- **Kat Coder Pro**
- **Kimi K2**
- **Gemini 2.5 Flash**
- **Gemini 2.5 Pro**

### 🔐 GitHub Integration
- Seamless GitHub authentication
- View your profile picture and username
- Browse all your repositories
- Analyze any branch
- Works with both public and private repos

---

## 📦 Installation & Setup

### Prerequisites
- VS Code ^1.80.0
- Node.js and npm installed
- Internet connection for AI API access
- GitHub account for authentication

### Steps to Run

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mukund-31/Code_Quality.git
   cd Code_Quality
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Launch Extension Development Host**
   - Open the project in VS Code
   - Press `F5` to launch the Extension Development Host
   - A new VS Code window will open with the extension loaded

5. **Start Using the Extension**
   - Click the Code Quality icon in the Activity Bar (sidebar)
   - Login with GitHub
   - Select your preferred AI model
   - Start reviewing code!

---

## 🎯 Usage Guide

### Getting Started

1. **Open the Extension**: Click the Code Quality icon in the Activity Bar (sidebar)
2. **Login**: Click "Login with GitHub" to authenticate
   - Auto-login works if you've previously authenticated
3. **Select Model**: Choose your preferred AI model from the dropdown (select once, use everywhere)
4. **Start Reviewing**: Choose from the available review options

### Review Options

#### 📂 Review Project (Local)

After clicking "Review Project", you get 3 choices:

1. **📄 Current File**
   - Reviews the file you currently have open
   - Quick and focused analysis
   - **How to use:**
     - Open a code file in VS Code
     - Click "Review Project" → "Current File"
     - Get instant AI review

2. **📁 Select Folder**
   - Opens a folder picker dialog
   - Choose any folder to review
   - Analyzes up to 50 files
   - **How to use:**
     - Click "Review Project" → "Select Folder"
     - Browse and select any folder
     - Get comprehensive folder analysis

3. **🗂️ Entire Workspace**
   - Reviews all code files in your workspace
   - Comprehensive analysis
   - Up to 20 files analyzed in detail
   - **How to use:**
     - Open a folder/workspace in VS Code
     - Click "Review Project" → "Entire Workspace"
     - Get full workspace analysis

#### 🔍 Browse My Repos (GitHub)

Review repositories directly from your GitHub account:

1. Click **"Browse My Repos"**
2. See all your GitHub repositories with:
   - Repository name and description
   - Stars ⭐ and Forks 🍴
   - Primary language
   - Public/Private status 🔒
3. Click on any repository
4. Select the branch you want to review
5. Click **"Start Review"**
6. Get comprehensive AI analysis!

**Benefits:**
- ✅ Works from anywhere
- ✅ No need to clone repos
- ✅ Review any branch
- ✅ Perfect for quick reviews
- ✅ Access all your GitHub repos

---

## 🎨 What You Get from Reviews

The AI analyzes and provides:
- **Code Quality**: Overall code quality assessment
- **Architecture**: Repository structure and organization
- **Security**: Potential security issues and vulnerabilities
- **Best Practices**: Recommendations for improvement
- **Bugs**: Potential bugs and issues
- **Suggestions**: Specific improvement suggestions

---

## ⚙️ Configuration

The extension uses your Cloudflare Worker at:
```
https://sarvi.hi-codequality.workers.dev/
```

---

## 🧪 Testing the Extension

### Complete Test Workflow

1. **Launch Extension Development Host**
   - Press `F5` in VS Code
   - New window opens

2. **Test Auto-Login**
   - Open Code Quality sidebar
   - If previously logged in, profile appears automatically
   - Otherwise, click "Login with GitHub"

3. **Test Current File Review**
   - Create a new file (`Cmd+N`)
   - Paste some code:
     ```javascript
     function add(a, b) {
         return a + b
     }
     console.log(add(5, 10))
     ```
   - Save as `test.js`
   - Click "Review Project" → "Current File"
   - ✅ Should show AI review

4. **Test Folder Review**
   - Click "Review Project" → "Select Folder"
   - Choose any folder with code files
   - ✅ Should analyze the folder

5. **Test Workspace Review**
   - Open a folder in VS Code (`File > Open Folder`)
   - Click "Review Project" → "Entire Workspace"
   - ✅ Should analyze all workspace files

6. **Test GitHub Repo Review**
   - Click "Browse My Repos"
   - Select any repository
   - Choose a branch
   - Click "Start Review"
   - ✅ Should show repository analysis

### Expected Behavior

✅ **CORRECT:**
- Login screen shows cleanly (no spinner)
- Auto-login if previously authenticated
- Loading spinner ONLY appears when actually reviewing code
- Profile dropdown works smoothly
- All sections properly hidden/shown
- Model selection on main page applies to all reviews

❌ **INCORRECT (Should NOT happen):**
- "Analyzing..." on login screen
- Multiple sections visible at once
- Loading spinner stuck visible
- Need to login every time
- Model selection popup on every review

---

## 🐛 Troubleshooting

### Common Error Messages (These are NORMAL)

| Error | What It Means | How to Fix |
|-------|---------------|------------|
| "No active file open" | No file is currently open in the editor | Open any code file |
| "No workspace folder open" | No folder is opened in VS Code | File > Open Folder |
| "No code files found in repository" | The opened folder has no code files | Open a folder with code files |

### Issues and Solutions

**Q: Extension doesn't appear in sidebar**
- Make sure you pressed F5 in the main VS Code window (not the Extension Development Host)

**Q: "Analyzing..." shows before login**
- This should be fixed. If you still see it, reload the Extension Development Host window

**Q: Can't see profile dropdown**
- Make sure you're logged in first
- Click the ⋮ button next to your profile picture

**Q: AI review returns error**
- Check that your Cloudflare Worker is running: `https://sarvi.hi-codequality.workers.dev/`
- Try a different AI model from the dropdown

**Q: Failed to load repositories**
- Check your internet connection
- Ensure GitHub is accessible
- Try logging out and back in

### Hard Reset (if needed)

```bash
# Close all VS Code windows
# Delete extension cache
rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage/*
# Restart VS Code
```

---

## 🔧 Development

### Project Structure

```
CQ_plugin/
├── src/                    # TypeScript source files
├── out/                    # Compiled JavaScript files
├── media/                  # Icons and styles
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

### Available Scripts

```bash
# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Run linter
npm run lint

# Run tests
npm run test
```

### Debugging

1. **Open Developer Tools** (in Extension Development Host):
   - Press `Cmd+Shift+P`
   - Type "Developer: Toggle Developer Tools"
   - Click on "Console" tab

2. **Check Console Logs**:
   - All actions are logged to console
   - Look for error messages
   - Check API responses

---

## 📋 Commands

Access these commands via Command Palette (`Cmd+Shift+P`):
- `Code Quality: Login to GitHub`
- `Code Quality: Review Current File`
- `Code Quality: Review Repository`
- `Code Quality: Review Pull Request`
- `Code Quality: Browse My Repositories`

---

## 🎯 Key Improvements

### Unified Model Selection
- ✅ Select model ONCE on main page
- ✅ All reviews use that model
- ✅ No repeated selections
- ✅ Clean, simple workflow

### Simplified UI
- One unified "Review Project" option instead of multiple buttons
- Clear selection screen with three options
- GitHub repos separate from local reviews
- Smooth animations and modern design

### Auto-Login
- Automatically detects existing GitHub session
- No need to login every time
- Seamless user experience

### Folder Selection
- Select any folder on your system
- No need to open in VS Code first
- Flexible and powerful

---

## 📝 Release Notes

### 0.0.1

Initial release with:
- AI-powered code review
- Multiple AI model support (6 models)
- GitHub integration
- File, folder, workspace, and GitHub repo review capabilities
- Unified model selection
- Simplified UI with clear options
- Auto-login functionality
- Profile dropdown with logout

---

## 🤝 Contributing

This project is ready to be pushed to GitHub. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- Powered by Cloudflare Workers
- Uses GitHub API via Octokit
- Built with VS Code Extension API

---

**Enjoy AI-powered code reviews!** 🚀

For issues or questions, please open an issue on GitHub: https://github.com/Mukund-31/Code_Quality.git
