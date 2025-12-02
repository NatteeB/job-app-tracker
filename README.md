# About the project
JobApplicationTracker is a small personal project for keeping job search organized. The goal is to have an easy way to record each job application, sort and filter them, and quickly see the details when I need them. Another goal is to have fun writing some code that does something usefull.

The frontend is built with React, TypeScript and Vite. It displays all jobs in a sortable table, so you can click on any column header to reorder the list by company, role, status, date and so on. The jobs could be filtered by status as well.

New jobs are added through a dialog. In that dialog you can either:
- paste a job description and let an AI helper parse it into structured fields (I'm using OpenAI API)
- fill in all the fields by hand if you prefer to stay in control

For the backend I experimented with two different implementations:
- a Python server using FastAPI
- an alternative Node.js server using Express with CORS enabled

Both versions serve the same purpose and power the same React UI, which lets me play with different stacks while working on one practical, real life app.

# Setup
- Clone the project

## Setup and run Python server

- Create python virtual environment using venv or conda (I'm using conda in this sample) and activate it.
- Setup project dependencies using `pip install fastapi uvicorn`
- Run `cd server`
- Run `uvicorn main:app --reload --port 8000` to start server on http://localhost:8000/
- Use `http://localhost:8000/data` to test the server
- Use `DBFILE = "data/sampleData.db"` constant to point to your real data.

## Setup and run Node.js server (alternatively)

- Run `cd server-nodejs`
- Run `npm install` to setup dependencies
- Run `node server.js` to start server on http://localhost:8000/
- Use `http://localhost:8000/data` to test the server
- Use `const DBFILE = "data/sampleData.db";` to point to your real data.

## Setup and run frontend

- Run `cd client`
- Run `npm install` to setup dependencies
- Run `npm run dev` to start the project on http://localhost:5173/

# Data file
The server points to `data/sampleData.db` SQLite database.
See `data/sqlite-setup.sql` file for the DB structure.

# App Experience
This project page contains a sortable table section with a list of job applications and a details section. 
Click on an icon in the table header to sort the rows. 
Click on a row to see job details in the Details section.
Click on the "Add New Job" button to add a new job.

![JobApplicationTracker](<./appScreenShotMain.png> 'Application main screen')
![JobApplicationTracker](<./appScreenShotDialog.png> 'Application new job dialog')

# Future development
- Add a progress spiner for AI processings
- Add ability to edit a cell
- Add ability to sanitize the details field and validate the date
