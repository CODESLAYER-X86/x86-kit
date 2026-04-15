# 🛠️ Maintenance & Update Guide

This guide explains how to maintain the `x86-kit` project, publish new features to npm, and ensure all installations stay synchronized.

---

## 👨‍💻 For You: Publishing Updates

Whenever you improve an agent, add a new skill, or refine a workflow, follow these steps to push the update to the public.

### 1. Save Your Changes
First, ensure all your code changes are committed to Git:
```bash
git add .
git commit -m "feat: described your new feature here"
```

### 2. Bump the Version
Use the `npm version` command to increment the project version. 
- For small fixes: `npm version patch` (e.g., 1.0.1 → 1.0.2)
- For new features: `npm version minor` (e.g., 1.0.1 → 1.1.0)
- For major overhauls: `npm version major` (e.g., 1.0.1 → 2.0.0)

### 3. Publish to npm
Since you have 2FA enabled, you must provide your OTP (One-Time Password) from your authenticator app:
```bash
npm publish --access public --otp=YOUR_CODE
```

### 4. Sync GitHub
Always keep your GitHub repository in sync with the npm version:
```bash
git push --follow-tags
```

---

## 🚀 For Users: Updating the Kit

When a new version is released, users can update their global installation and their local project files.

### 1. Update Global Package
To get the latest version of the CLI tool:
```bash
npm install -g x86-kit@latest
```

### 2. Update a Project
If a project already has an `.x86-kit` folder but needs the latest agents/skills:
1. Navigate to the project folder.
2. Run the initialization command again:
   ```bash
   x86-kit init
   ```
   *Note: This will overwrite the existing `.x86-kit` folder with the latest master files from your global installation.*

---

## 💡 Best Practices
- **Atomic Commits:** Try to commit one feature or fix at a time.
- **Test Before Publishing:** Run `x86-kit status` or check your files locally before pushing to npm.
- **Changelog:** It's helpful to briefly update the `README.md` "What's Inside" section if you add a major new agent category.

---
**Happy Orchestrating!** 🚀
