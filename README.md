Gaia_leave_frontend
Workforce Management System (Frontend)

Overview
GaiaLeave frontend is a React application that provides a modern user interface for managing employee attendance, leave requests, and overtime records. It connects to the Spring Boot backend and offers secure, role‑based access with intuitive forms and dashboards. In addition to tracking absences, the frontend enables HR personnel, managers, and employees to monitor working hours, approve overtime, and view payroll‑related information through interactive dashboards.

Technology Stack
Language: JavaScript (ES6+)

Framework: React 18

Build Tool: npm / yarn

UI Library: CoreUI React

Routing: React Router

State Management: Redux Toolkit

Styling: SCSS

Project Structure

```
gaia-leave-frontend
├── public/          # static files
│   └── index.html   # html template
│
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # reusable UI components
│   ├── layouts/     # layout containers
│   ├── scss/        # global styles
│   ├── views/       # application views (pages)
│   ├── _nav.js      # sidebar navigation config
│   ├── App.js       # root component
│   ├── index.js     # entry point
│   ├── routes.js    # routes configuration
│   └── store.js     # Redux store setup
│
└── package.json

```
Getting Started

Ensure you have Node.js  (>=18) installed

Clone the repository

Install dependencies:

```bash
npm install
```
or

```bash
yarn install
```

Start the development server:
```bash
npm start
```
or
```bash
yarn start
```
The app will run at http://localhost:3000.

Build
To build the project for production:

```bash
npm run build
```

or

```bash
yarn build
```

The optimized build will be stored in the build/ directory.

Developed and maintained by Minja and Siniša
