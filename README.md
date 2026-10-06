# Archistician

A personal productivity web app inspired by the habit scorecard from *Atomic Habits*. It helps users build better routines by reflecting on their day, tracking their finances, and capturing ideas in one place.

## Demo video: [https://youtu.be/78mJWK2ORDA]

**Features**
**Daily Habit Scorecard:** fill out at the end of each day to rate your habits as positive, negative, or neutral
**Finance Calculator:** track and calculate personal spending and budgets
**Idea Keeper:** save and organize ideas as they come

**Built with:** React, JavaScript, Flask, Python

# user's manual


## STARTING THE BACKEND

*Prerequisites:*
Have Node.js (which includes npm) and python 3 installed on your computer
If you don't, please download them from the official Python and Node.js websites.
To check if you have them istalled correctly, run on your terminal:

- `python --version` or `python3 --version` (for python), and
- `node -v` and `npm-v` (for Node.js)
  
These should both give you version numbers.

Once you have these installed, restart VS code and unzip the folder.
Start the backend first. To do this, open a new terminal,
cd into Archistician, and then into flask-server, and then run the following commands:

- `pip install -r requirements.txt` to install dependencies, and then
- `python app.py` OR
- Windows:`py -m flask run` Mac: `flask run` to start the backend

This command runs the backend in the development mode.\
The backend runs on [http://localhost:5000](http://localhost:5000)

## STARTING THE FRONT END

Open a separate terminal and navigate to the frontend i.e:
(cd into Archistician, and then into archistician),
Run the following commands:

- `npm install` to install dependencies, and then
- `npm run start` or `npm start` to start the front end

This command runs the app in the development mode.\
The web app will open automatically, but if it doesn't,
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page automatically reloads when changes are made.\

## To see what the app looks like with prestored user data

Log in to Nkengfua Faith's account (account I already created and added data to)
Username: Nkengfua Faith
Password: 100200
