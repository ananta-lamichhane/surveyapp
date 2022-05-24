# A Hybrid Evaluation Scheme for Making Qualitative Feedback Available to Recommender Systems Researchers

### Easily conduct user studies and offline evaluations for recommender systems research

## Introduction

## Getting Started

### Prerequisites
A windows / linux system with Python 3.10 and pip for the backend and Node Package Manager (npm) and NodeJS must be installed for the frontend.

## Directory structure
The project is divided into two independent parts. The frontend directory consists of all files and data pertaining to the web application components while the backend directory contains all data (datasets, recommendation lists, evaluation results and artefacts.) and API functionality.
### Backend
#### data
The data directory contains the datasets, recommendation lists for online evaluations and the results generated from the online and offline evaluation in datasets, recommendation_lists and results directories respectively.


### src
The src folder contains all source code for the API built up using Flask in python. The src directory contains 

### Installation
This project uses react JS for frontend ans Python Flask as backend / API. To customize and make changes to the project before deployment, following steps are necessary:
#### 1. Clone the repository.
git clone https://github.com/ananta-lamichhane/surveyapp.git
#### 2. Install backend 
1. Change to the survey directory of the cloned repo.
2. Create a python virtual environment python3 -m venv venv
3. Activate the virtual environment source venv/bin/activate
4. Install the requirements from requirements.txt file. pip install -r backend/requirements.txt
5. Serve the application with gunicorn on port 5000. gunicorn --bind 0.0.0.0:5000 backend.src.app:app
  To run the server in background, use --daemon argument at the end of command in 5.
  
#### 3. Install frontend
1. Make sure NodeJS is installed. Use official documentation.
2. Change directory to survey/frontend.
3. Install necessary modules. npm install
4. Start the node server on port 3000.

#### 4. Prepare the data
Certain directories and file name conventions must be followed so that the relevant data (datasets, recommendation lists, matchmaking and next-item selection) can be properly configured.
1. To add a new database for a survey, create a new directory inside data/datasets with the relevant name of the directory (the directory name will be visible when using the dashboard to create and manage surveys) and place the ratings.csv user-item matrix file into the directory.
2. To add a new recommendation list for online evaluation, put the relevant recommendation list file in the recommendation_lists directory. The name of the file identifies the recommendation lists file (<filename>.csv) while creating and managing the survey.


## Customization
You can implement your own matchmaking logic and next-item selection logic. The abstract classes in backend/src/strategies need to be implemented.
Name each instantiated class "Strategy" and keep save each instance on a different file. The file names are display on the survey creation dashboard to denote
the corresponding strategies.

## Deployment
1. Clone the repository
2. Change directory to survey directory
3. To deploy the Flask API server:
4. To deploy the frontend react web application
5. Make the API available to the internet as e.g. api.mydomain.com. 
6. Make the frontend available as e.g. survey.mydomain.com. Change the REACT_APP_API_URL environment variable in survey/frontend/.env to the API URI.

