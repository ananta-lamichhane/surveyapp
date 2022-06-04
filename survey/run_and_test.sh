#!/bin/bash
echo "Running backend on port 5000."
echo "Checking requirements"

echo "creating venv"
python3 -m venv venv

echo "activating venv"

path=$PWD
echo $path #/home/ubuntu
subpath="/venv/bin/activate"
new_path="$path$subpath" #/home/ubuntu/data
echo $new_path #/home/ubuntu/data
source $new_path

echo "install requirements"
pip install -r $PWD/backend/src/requirements.txt

gunicorn --bind 0.0.0.0:5000 backend.src.app:app --daemon

echo "checking if the server is up"
HTTP_CODE=$(curl --write-out "%{http_code}\n" "http://localhost:5000/survey" --output output.txt --silent)

if [$"HTTP_CODE" -ne 200]
then
    echo "API server is not online. Please check"
else
    echo "API Server is online."

    cd frontend
    npm start&
    sleep 5

    echo "checking if the server is up"
    HTTP_CODE=$(curl --write-out "%{http_code}\n" "http://localhost:3000/survey" --output output.txt --silent)
    if [$"HTTP_CODE" -ne 200]
    then
    echo "API server is not online. Please check"
    else
    echo "Survey server is on."
    cd ..
    fi

fi

