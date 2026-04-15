# 🛠️ Maintenance & Update Guide

This guide explains how to maintain the `x86-kit` project, publish new features to npm, and ensure all installations stay synchronized.

---

## 📥 Local Ingestion Workflow

You can stage new agents, skills, and workflows in the `new/` directory. The kit can then "absorb" them into the master `.x86-kit` folder without overwriting existing logic.

### 1. Stage Your New Items
Create your new components inside the `new/` folder using the standard structure:
- `new/agents/my-agent.md`
- `new/skills/my-skill/`
- `new/workflows/my-workflow.md`

### 2. Run Ingest
From the root of the project, run:
```bash
node bin/x86-kit.js ingest
```
*(Or simply `x86-kit ingest` if installed globally)*.

This command will check if each item already exists in `.x86-kit`. If it's missing, it will be added. If it exists, it will be skipped (protecting your master files).

---

---

## 👨‍💻 Syncing Your Private Brain

Since you want to keep your custom logic (like `ingest`) private for yourself only, **NEVER** run the `npm publish` command on this codebase. Instead, use your GitHub repository and local linking to manage your superpowers.

> [!CAUTION]
> **DO NOT PUBLISH TO NPM.**
> Running `npm publish` will make your "secret sauce" (the `ingest` command and custom agents) public for anyone to download. Only push to GitHub to keep your modifications private.

### 1. Save & Backup (GitHub)
Push your latest changes to your GitHub repository. This acts as your private backup in the cloud:
```bash
git add .
git commit -m "feat: added new custom logic"
git push
```

### 2. Lock In Globally (npm link)
To ensure your global `x86-kit` command always uses your latest private modifications on this machine:
```bash
npm link
```

### 3. Syncing to a New Machine
If you move to a new computer, simply clone your repository and run:
```bash
npm install -g .
# OR
npm link
```
This installs **your** personal version globally without touching the public npm registry.

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
- **Local Testing:** Test your new agents using `x86-kit ingest` and then verify they work in a test project.
- **Documentation:** If you add a major new agent, update the `README.md` "What's Inside" section so you remember what it does!

---
**Happy Orchestrating!** 🚀
