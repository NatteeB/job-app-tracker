# About the project

This JobApplicationTracker project is dedicated to tracking job applications. The goal here is to have a simple app that allows to keep track, sort, highlight and see details of each job application.
Another goal is to have fun writing some code that does something usefull.

The project UI is written with React + TypeScript + Vite.

The server side is written with Python + FastAPI.

# Setup
- Clone the project

## Setup and run server

- Create python virtual environment using venv or conda (I'm using conda in this sample) and activate it.
- Setup project dependencies using `pip install fastapi uvicorn`
- Run `uvicorn server.main:app --reload --port 8000` to start server on http://localhost:8000/
- Use `http://localhost:8000/data` to test the server.

## Setup and run frontend

- Run `npm install` to setup dependencies
- Run `npm run dev` to start the project on http://localhost:5173/

# Data file
The data file for the project is in `/data/jobDataSample.json`
The data are expected to be in JSON format and the details property is assumed to contain HTML content. If you modify this file, make sure to add trusted and sanitized content into the fileds.
You can also point to the data using your own file in App.tsx
```
import data from './data/jobDataSample.json';
```

# App Experience
This project page contains a sortable table section with a list of job applications and a details section. 
Click on an icon in the table header to sort the rows. 
Click on a row to see job details in the Details section.

![JobApplicationTracker](<./public/appScreenShot.png> 'Application screen shot')

# Future development
- Add ability to add a row
- Add ability to edit a cell
- Add ability to sanitize the details field and validate the date
