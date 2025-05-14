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
```

---

## 📋 Available Templates

DevStack CLI currently supports the following project templates:

| Template | Description | Command |
|----------|-------------|---------|
| **React App** | React application with Vite and optional Tailwind CSS | `devstack create react-app my-app` |
| **Node.js API** | RESTful API with Express, dotenv, cors, and morgan | `devstack create node-api my-api` |
| **Django App** | Django web application with Python | `devstack create django-app my-django-project` |
| **Next.js App** | Next.js React application with full SSR support | `devstack create nextjs-app my-next-project` |
| **Vue App** | Vue.js application with Vite | `devstack create vue-app my-vue-project` |
| **Flask API** | Python API with Flask and CORS support | `devstack create flask-api python-api` |
| **MERN Stack** | Full MongoDB, Express, React, Node.js application | `devstack create mern-stack fullstack-app` |
| **Static Site** | Static website using 11ty | `devstack create static-site my-blog` |

---

## 🔍 Usage Examples

### JavaScript/TypeScript Projects

```bash
# Create a React application with Vite
devstack create react-app my-react-app

# Create a Next.js application
devstack create nextjs-app my-next-project

# Create a Vue.js application
devstack create vue-app my-vue-app
```

### Backend APIs

```bash
# Create a Node.js/Express API
devstack create node-api my-express-api

# Create a Flask Python API
devstack create flask-api my-flask-api
```

### Full-Stack Applications

```bash
# Create a MERN (MongoDB, Express, React, Node.js) stack application
devstack create mern-stack my-fullstack-app
```

### Python Web Applications

```bash
# Create a Django application
devstack create django-app my-django-project
```

### Static Sites

```bash
# Create a static site with 11ty
devstack create static-site my-blog
```

---

## 🧩 Template Structure

Each template in DevStack CLI includes:

- **Pre-configured commands**: Automatically sets up project dependencies
- **Dynamic file generation**: Creates files with your project's name and settings
- **Standard configuration files**: Includes README, .env, and other necessary files
- **Project-specific structures**: Follows best practices for each technology

---

## 🔧 Customizing Templates

You can extend DevStack by adding your own templates or modifying existing ones in the `config.js` file:

```javascript
// Add a custom template
templates['my-custom-template'] = {
  description: 'My custom project template',
  commands: [
    // Define commands to run
    { command: 'mkdir {{projectName}}', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    { command: 'npm init -y', interactive: false },
    // Add more commands as needed
  ],
  dynamicFiles: [
    // Define files to generate
    {
      path: 'README.md',
      content: `# {{projectName}}
      
Custom project created with DevStack CLI.`
    }
    // Add more files as needed
  ]
};
```

---

## 📋 Requirements

- Node.js 16+
- npm or yarn
- For Python templates: Python 3.6+ with venv
- For specific frameworks: Required dependencies will be installed automatically

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.


## 💡 Author
Created and maintained by Umar Shaikh 🚀