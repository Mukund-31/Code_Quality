

# <img src="https://github.com/user-attachments/assets/10fe3c86-6605-4e81-a93d-7d2fa5a5d5eb" width="120"/>

# **Code Quality – AI Code Review Assistant**

A powerful VS Code extension combined with a GitHub-integrated AI platform that provides automated code reviews, PR summaries, developer insights, team metrics, and manager analytics.
Built for high-quality engineering workflows and modern AI-assisted development.

---
# <img src="https://github.com/user-attachments/assets/10fe3c86-6605-4e81-a93d-7d2fa5a5d5eb" width="120"/>


# Problem Statement

### 🔧 Engineering Teams

* Struggle to maintain consistent code quality
* Manual code reviews are slow, inconsistent, and expensive
* Developers lack automated guidance and best-practice enforcement

### Leadership & Management

* No reliable, privacy-first way to monitor **team health**, **burnout indicators**, or **engineering ROI**
* Lack of visibility into code quality trends and AI tool adoption

---

# Our Solution

**Code Quality** solves both developer-side and manager-side problems using an integrated AI system.

## ✔ Core Solution

* VS Code extension with local + GitHub repository analysis
* Cloudflare Workers powering AI code reviews using 3–5 coding models
* Developer-facing suggestions & automated PR summaries
* Manager dashboard with team metrics and project insights

---

# 🚀 Features

## Developer-Facing AI Features

* **Automated Line-by-Line Code Reviews**
  Bug fixes, optimizations, refactoring suggestions, security checks.
* **AI-Generated Pull Request Summaries**
  Saves reviewer time and improves clarity.
* **Context-Aware Feedback**
  Understands code intent before suggesting improvements.
* **Configurable Team Rules**
  Enforce custom coding standards.

---

## 🧠 Multiple AI Models Supported

Powered by your Cloudflare Worker:

* **DeepSeek v3.1** (Default)
* **GPT OSS 20B**
* **Kat Coder Pro**
* **Kimi K2**
* **Gemini 2.5 Flash / Pro**

Choose once → used across all review operations.

---

## 🔐 GitHub Integration

* One-click GitHub login
* Auto-login on next use
* View profile, avatar & username
* Browse all repositories instantly
* Select branches for review
* Review PRs or compare branches without cloning

---

# 🧩 Review Options

### 📄 Review Current File

Analyze the open file in the editor.

### 📁 Review Selected Folder

Choose any folder from your system.

### 🗂 Review Entire Workspace

Analyze your full VS Code workspace.

### 🐙 Review GitHub Repositories

* Browse all repos
* Choose branches
* Compare base vs compare branch
* Trigger AI review instantly

---

# 🖥️ Architecture

### 1. **VS Code Plugin**

Collects file/workspace context, PR diffs, and repo metadata.

### 2. **Cloudflare Worker**

Runs 3–5 AI models to generate:

* Code reviews
* Summaries
* Suggestions
* Insights

### 3. **Manager Dashboard**

Shows:

* Workload summaries
* Burnout indicators
* Team health scores
* ROI & productivity trends

---

# 💼 Business Model (Tiered)

### 🆓 Free Plan

Basic usage with limited features.

### 🔵 Pro Plan (For Developers)

* Line-by-line AI PR reviews
* Bug detection & improvement suggestions
* Faster review cycles

### 🟡 Elite Plan (For Managers)

* Access to Manager Dashboard
* Privacy-first analytics
* Burnout insights
* Team health indicators
* Engineering impact metrics
* AI adoption ROI tracking

---

# 📥 Installation & Setup

### Prerequisites

* VS Code 1.80+
* Node.js & npm
* Cloudflare Worker running
* GitHub account

### Steps

```bash
git clone https://github.com/Mukund-31/Code_Quality.git
cd Code_Quality
npm install
npm run compile
```

### Launch in Development Mode

* Open project in VS Code
* Press **F5**
* New VS Code window launches with extension loaded

---

# 🧪 Testing the Extension

### ✔ Auto-login

GitHub account auto-detected.

### ✔ Review Current File

File → Review Project → Current File.

### ✔ Review Folder

Review Project → Select Folder.

### ✔ Review Workspace

Review Project → Entire Workspace.

### ✔ GitHub Repo Review

Browse My Repos → select → choose branch → start review.

---

# ⚙️ Configuration

Cloudflare Worker endpoint:

```
https://sarvi.hi-codequality.workers.dev/
```

---

# 🔧 Development

### Project Structure

```
CQ_plugin/
├── src/
├── out/
├── media/
├── package.json
├── tsconfig.json
└── README.md
```

### Commands

```bash
npm run compile
npm run watch
npm run lint
npm run test
```

---

# 👥 Team

* **Mukund Verma**
* **Shashidhar Sarvi**

---

# 🙏 Acknowledgments

* Cloudflare Workers
* GitHub API (Octokit)
* VS Code Extension API

---

# 🎉 Enjoy AI-powered code reviews!

Let me know if you want:

* A shorter README
* A more marketing-oriented README
* A screenshot-rich README
* A version with badges & icons
* A GitHub landing page website for this project
