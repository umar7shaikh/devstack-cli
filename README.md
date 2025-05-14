# 🚀 DevStack CLI

DevStack CLI is a powerful, extensible command-line tool to instantly scaffold modern project boilerplates — from React + Vite apps to Node.js APIs and Python backends. Save time setting up repetitive folders and configs — just run a single command!

---

## 📦 Features

- ⚡ Rapidly scaffold full project structures
- 🧱 Built-in templates: React, Node.js, Django, and more
- 🛠️ Automatically installs dependencies & sets up folder structure
- 📂 Generates `.env`, `README.md`, `package.json`, and more
- ✨ Easily extendable with custom templates

---

## 🛠️ Project Setup

Follow these steps to set up and use DevStack CLI on your local machine:

```bash
# 1. Clone the repository
git clone https://github.com/umar7shaikh/devstack-cli.git
cd devstack-cli

# 2. Install dependencies
npm install

# 3. Run the CLI tool locally
node index.js create <template-name> <project-name>
# Example:
node index.js create node-api my-api

# 4. (Optional) Link globally as `devstack`
npm link

# Now you can use it anywhere:
devstack create react-app my-app

