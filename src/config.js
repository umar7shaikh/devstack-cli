// src/config.js
const path = require('path');
const fs = require('fs-extra');

// Template definitions - now with commands for real CLI execution
const templates = {
  'react-app': {
    description: 'React application with Vite',
    // Executing the actual commands rather than copying templates
    commands: [
      // Create Vite project with React template directly with flag
      {
        command: 'npm create vite@latest {{projectName}} -- --template react',
        interactive: false
      },
      // Navigate to project directory and install dependencies
      { command: 'cd {{projectName}}', interactive: false },
      { command: 'npm install', interactive: false },
      // Optional: Install Tailwind CSS (if needed)
      { command: 'npm install -D tailwindcss@3 postcss autoprefixer', interactive: false },
      { command: 'npx tailwindcss init -p', interactive: false }
    ]
  },
  'node-api': {
    description: 'Node.js API with Express',
    commands: [
      // Create project directory
      { command: 'mkdir {{projectName}}', interactive: false },
      { command: 'cd {{projectName}}', interactive: false },
      // Initialize npm project
      { command: 'npm init -y', interactive: false },
      // Install dependencies
      { command: 'npm install express dotenv cors morgan', interactive: false },
      { command: 'npm install --save-dev nodemon', interactive: false }
    ],
    // Define files to be generated
    dynamicFiles: [
      {
        path: 'src/index.js',
        content: `require('dotenv').config();
        const express = require('express');
        const cors = require('cors');
        const morgan = require('morgan');

        const app = express();

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(morgan('dev'));

        // Routes
        app.use('/api', require('./routes'));

        // Root endpoint
        app.get('/', (req, res) => {
          res.json({ message: 'Welcome to {{projectName}} API' });
        });

        // Error handling
        app.use((err, req, res, next) => {
          console.error(err.stack);
          res.status(500).json({ error: 'Something went wrong!' });
        });

        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
          console.log(\`Server running on port \${PORT}\`);
        });`
      },
      {
        path: 'src/routes/index.js',
        content: `const express = require('express');
const router = express.Router();

// Example route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

module.exports = router;`
      },
      {
        path: '.env',
        content: `PORT=3000
NODE_ENV=development`
      },
      {
        path: 'README.md',
        content: `# {{projectName}}

Node.js API created with DevStack CLI.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

## API Endpoints

- GET / - Welcome message
- GET /api/hello - Example endpoint
`
      },
      {
        path: 'package.json',
        content: `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "Node.js API created with DevStack CLI",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }
}`
      }
    ]
  },
  'django-app': {
  description: 'Django web application with Python',
  commands: [
    // Create virtual environment
    { command: 'python -m venv {{projectName}}_env', interactive: false },
    // On Windows, use the activate.bat file
    { command: '{{projectName}}_env\\Scripts\\activate.bat && pip install django djangorestframework', interactive: false },
    // Use the fully qualified path to django-admin
    { command: '{{projectName}}_env\\Scripts\\django-admin startproject {{projectName}} .', interactive: false },
    // Make sure to run Django commands with the activated environment
    { command: '{{projectName}}_env\\Scripts\\python manage.py startapp core', interactive: false },
    { command: '{{projectName}}_env\\Scripts\\python manage.py makemigrations', interactive: false },
    { command: '{{projectName}}_env\\Scripts\\python manage.py migrate', interactive: false }
  ],
  dynamicFiles: [
    {
      path: 'README.md',
      content: `# {{projectName}}

Django web application created with DevStack CLI.

## Getting Started

\`\`\`bash
# Activate virtual environment
source {{projectName}}_env/bin/activate  # On Windows: {{projectName}}_env\\Scripts\\activate

# Run development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser
\`\`\`

## Project Structure

- core/ - Main application
- {{projectName}}/ - Project settings
`
    },
    {
      path: '.gitignore',
      content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media

# Virtual Environment
{{projectName}}_env/
venv/
ENV/

# IDE
.idea/
.vscode/
*.swp
*.swo
`
    }
  ]
},

  'nextjs-app': {
  description: 'Next.js application with React',
  commands: [
    { command: 'npx create-next-app@latest {{projectName}}', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    { command: 'npm install', interactive: false }
  ],
  dynamicFiles: [
    {
      path: 'README.md',
      content: `# {{projectName}}

Next.js application created with DevStack CLI.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Learn More

Visit [Next.js Documentation](https://nextjs.org/docs) to learn more about Next.js features and API.
`
    }
  ]
},

'vue-app': {
  description: 'Vue.js application with Vite',
  commands: [
    { command: 'npm create vite@latest {{projectName}} -- --template vue', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    { command: 'npm install', interactive: false }
  ]
},

'flask-api': {
  description: 'Flask API with Python',
  commands: [
    // Create project directory first
    { command: 'mkdir {{projectName}}', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    // Then create virtual environment
    { command: 'python -m venv venv', interactive: false },
    // Install packages using the virtual env's pip
    { 
      command: 'venv\\Scripts\\pip install flask flask-cors python-dotenv',
      interactive: false 
    }
  ],
  dynamicFiles: [
    {
      path: 'app.py',
      content: `from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to {{projectName}} API'})

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask API!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
`
    },
    {
      path: '.env',
      content: `PORT=5000
FLASK_ENV=development
`
    },
    {
      path: 'requirements.txt',
      content: `flask==2.3.2
flask-cors==4.0.0
python-dotenv==1.0.0
`
    },
    {
      path: 'README.md',
      content: `# {{projectName}}

Flask API created with DevStack CLI.

## Getting Started

\`\`\`bash
# Activate virtual environment
source {{projectName}}_env/bin/activate  # On Windows: {{projectName}}_env\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
\`\`\`

## API Endpoints

- GET / - Welcome message
- GET /api/hello - Example endpoint
`
    }
  ]
},


'mern-stack': {
  description: 'Full-stack MERN application (MongoDB, Express, React, Node)',
  commands: [
    // Create project directory
    { command: 'mkdir {{projectName}}', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    // Initialize backend
    { command: 'mkdir backend', interactive: false },
    { command: 'cd backend', interactive: false },
    { command: 'npm init -y', interactive: false },
    { command: 'npm install express mongoose dotenv cors morgan jsonwebtoken bcryptjs', interactive: false },
    { command: 'npm install --save-dev nodemon', interactive: false },
    { command: 'cd ..', interactive: false },
    // Initialize frontend with React
    { command: 'npm create vite@latest frontend -- --template react', interactive: false },
    { command: 'cd frontend', interactive: false },
    { command: 'npm install axios', interactive: false },
    { command: 'npm install', interactive: false },
    { command: 'cd ..', interactive: false }
  ],
  dynamicFiles: [
    // Backend files
    {
      path: 'backend/server.js',
      content: `require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', require('./routes/api'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/{{projectName}}')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to {{projectName}} API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
    },
    {
      path: 'backend/routes/api.js',
      content: `const express = require('express');
const router = express.Router();

// Example route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the MERN API!' });
});

module.exports = router;`
    },
    {
      path: 'backend/.env',
      content: `PORT=5000
MONGODB_URI=mongodb://localhost:27017/{{projectName}}
NODE_ENV=development`
    },
    // Project README
    {
      path: 'README.md',
      content: `# {{projectName}}

Full-stack MERN application created with DevStack CLI.

## Getting Started

### Backend

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Project Structure

- backend/ - Express and MongoDB API
- frontend/ - React application
`
    }
  ]
},


'static-site': {
  description: 'Static website with 11ty',
  commands: [
    { command: 'mkdir {{projectName}}', interactive: false },
    { command: 'cd {{projectName}}', interactive: false },
    { command: 'npm init -y', interactive: false },
    { command: 'npm install @11ty/eleventy', interactive: false }
  ],
  dynamicFiles: [
    {
      path: '.eleventy.js',
      content: `module.exports = function(eleventyConfig) {
  // Copy the "assets" directory to the output
  eleventyConfig.addPassthroughCopy("assets");
  
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};`
    },
    {
      path: 'src/index.njk',
      content: `---
layout: base.njk
title: Welcome to {{projectName}}
---

<div class="container">
  <h1>Welcome to {{projectName}}</h1>
  <p>This is a static site created with 11ty.</p>
</div>`
    },
    {
      path: 'src/_includes/base.njk',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  
  <main>
    {{ content | safe }}
  </main>
  
  <footer>
    <p>&copy; {{ page.date.getFullYear() }} {{projectName}}</p>
  </footer>
</body>
</html>`
    },
    {
      path: 'src/about.njk',
      content: `---
layout: base.njk
title: About | {{projectName}}
---

<div class="container">
  <h1>About</h1>
  <p>This is the about page for {{projectName}}.</p>
</div>`
    },
    {
      path: 'assets/css/style.css',
      content: `/* Basic styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #0066cc;
}

footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.8rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}`
    },
    {
      path: 'package.json',
      content: `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "Static site created with 11ty and DevStack CLI",
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }
}`
    },
    {
      path: 'README.md',
      content: `# {{projectName}}

Static website created with 11ty and DevStack CLI.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
\`\`\`

## Project Structure

- src/ - Source files
- _site/ - Generated site (after building)
- assets/ - Static assets (CSS, images, etc.)
`
    }
  ]
}

};

function getTemplateConfig(templateName) {
  return templates[templateName];
}

function getAllTemplates() {
  return templates;
}

module.exports = {
  getTemplateConfig,
  getAllTemplates
};