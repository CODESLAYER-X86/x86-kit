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

---

## 👨‍💻 Private Management Suite

Your kit features a **Hidden Engineering Toolbox** (`private-tools.js`) that is strictly excluded from npm but available in your local Git repo. Use these commands for professional, one-button maintenance.

### 1. The Stealth Ingest
Absorb new creations from your `new/` folder into the master `.x86-kit` brain.
```bash
x86-kit ingest
```

### 2. The Private Sync (Deploy)
This is your **one-button sync**. It automatically commits all changes, pushes them to your private GitHub, and refreshes your global command locally. **This never touches npm.**
```bash
x86-kit deploy
```

### 3. The Public Launch (Ship)
When you want to update the **Public Agents** on npm, use this command. It automatically bumps the version and publishes your kit while **masking** your private engineering tools from the public package.
```bash
x86-kit ship --otp=YOUR_2FA_CODE
```

> [!CAUTION]
> **NEVER RUN `npm publish` MANUALLY.**
> Always use `x86-kit ship`. The ship command ensures your engineering "secret sauce" remains private while only your Agents go public.

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
