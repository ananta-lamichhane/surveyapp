#!/bin/bash

## Author: Ananta Lamichhane

########################## INTRODUCTION AND PURPOSE #############################
## This script performs all the steps to install and run both
## frontend and API server. It performs the following step:
## 1.creates a python virtual environment in survey directory
## 2. activates the venv created in 1.
## 3. Installs all necessary packages specified by backend/src/requirements.txt
## 4. Runs the flask API server using gunicorn on port 5000.
## 5. Checks if the API server is on.
## 6a. If API server can' start, breaks the process.
## 6b. If API server has started, installs necessary npm modules in survey/frontend.
## 7. After installing modules, starts the app on port 3000 in background.
## 8. Waits 5 sec. to allow app to initialize, and checks if it's on.
## 9. Ends script after coming back to the survey directory.

###################################   USAGE  ############################
## change permissions to be able to run the script: chmod +x run_and_test.sh
## run using: source run_and_test.sh


API_URL="http://localhost:5000"
SURVEY_URL="http://localhost:3000/survey"



echo "Running backend on port 5000."
echo "Checking requirements"

echo "creating venv"
python3 -m venv venv

echo "activating venv"

path=$PWD
subpath="/venv/bin/activate"
new_path="$path$subpath" #/home/ubuntu/data
source $new_path

echo "install requirements"
pip install -r $PWD/backend/src/requirements.txt

gunicorn --bind 0.0.0.0:5000 backend.src.app:app --daemon
sleep 5
echo "checking if the server is up"
HTTP_CODE=$(curl --write-out "%{http_code}\n" "$API_URL" --output output.txt --silent)

if [$"HTTP_CODE" -ne 200]
then
    echo "API server is not online. Please check"
else
    echo "API Server is online."

    cd frontend
    npm install
    npm start&
    sleep 5

    echo "checking if the server is up"
    HTTP_CODE=$(curl --write-out "%{http_code}\n" "$SURVEY_URL" --output output.txt --silent)
    if [$"HTTP_CODE" -ne 200]
    then
    echo "Survey server is not online. Please check"
    else
    echo "Survey server is on."
    cd ..
    fi

fi


