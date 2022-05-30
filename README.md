# A Hybrid Evaluation Scheme for Making Qualitative Feedback Available to Recommender Systems Researchers

### Easily conduct user studies and offline evaluations for recommender systems research

## Introduction

## Getting Started

### Prerequisites
A computer with linux or windows with Python 3.10 and pip for the backend and Node Package Manager (npm) and NodeJS must be installed for the frontend. The code was tested with a Ubuntu 20.04 server with Python 3.10 installed.
Check if the necessary requirments are installed as follows.
1. Checking python, NodeJS and pip version
Open a bash terminal (linux) or command prompt / powershell terminal (windows) and type the following commands to show the current versions of the installed applications. If not installed, the commands won't produce any output.
Python: python --version
Pip: pip --version
NodeJS: node --version

If not already installed, follow the official documentations to get and install.
Python: https://wiki.python.org/moin/BeginnersGuide
Pip: https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line
NodeJS: https://nodejs.org/en/download/



## Directory structure
The project is divided into two independent parts. The frontend directory consists of all files and data pertaining to the web application components while the backend directory contains all data (datasets, recommendation lists, evaluation results and artefacts.) and API functionality.
### Backend
#### data
The data directory contains the datasets, recommendation lists for online evaluations and the results generated from the online and offline evaluation in datasets, recommendation_lists and results directories respectively.


### src
The src folder contains all source code for the API built up using Flask in python.

### Frontend
The frontend directory resembles a directory structure created automatically by create-react-app. All react components related to the survey frontend are located in the src/components directory.

### Installation
This project uses react JS for frontend ans Python Flask as backend / API. To customize and make changes to the project before deployment, following steps are necessary:
#### 1. Clone the repository.
`git clone https://github.com/ananta-lamichhane/surveyapp.git`
#### 2. Install backend 
1. Change to the survey directory of the cloned repo.
2. Create a python virtual environment
`python3 -m venv venv`
4. Activate the virtual environment 
`source venv/bin/activate`
6. Install the requirements from requirements.txt file. 
`pip install -r backend/src/requirements.txt`
8. Serve the application with gunicorn on port 5000. 
`gunicorn --bind 0.0.0.0:5000 backend.src.app:app`
  To run the server in background, use `--daemon` argument at the end of command in 5.
  
#### 3. Install frontend
1. Make sure NodeJS is installed. Use official documentation.
2. Change directory to survey/frontend.
3. Install necessary modules. 
`npm install`
5. Start the node server on (defualt) port 3000.
`npm start`

#### 4. Prepare the data
Certain directories and file name conventions must be followed so that the relevant data (datasets, recommendation lists, matchmaking and next-item selection) can be properly configured.
1. To add a new dataset for a survey, create a new directory inside data/datasets with the relevant name of the directory (the directory name will be visible when using the dashboard to create and manage surveys) and place the ratings.csv user-item matrix file into the directory.
2. To add a new recommendation list for online evaluation, put the relevant recommendation list file in the recommendation_lists directory. The name of the file identifies the recommendation lists file (<filename>.csv) while creating and managing the survey.

#### 5. Add next item selection and matchmaking strategies
1. To use custom next-item selection strategy, implement the abstract class called BaseStrategy in file item_selection_base.py. The implemented class must be named "Strategy". The file must be placed in the backend/src/strategies/item_selection directory. The name of the file is used to identify the strategy in survey creation and management.
2. To use custom matchmaking strategy, implement the abstract class called MatchmakingBase in file matchmaking_strategy_base.py. The implemented class must be named "Strategy". The file must be placed in the backend/src/strategies/item_selection directory. The name of the file is used to identify the strategy in survey creation and management.

#### 6. Get evaluation results
The results from evaluations are saved in backend/results. The results of online evaluations (surveys) are denoted by the respective survey names.
## Customization
You can implement your own matchmaking logic and next-item selection logic. The abstract classes in backend/src/strategies need to be implemented.
Name each instantiated class "Strategy" and keep save each instance on a different file. The file names are display on the survey creation dashboard to denote
the corresponding strategies.

## Deployment
Deployment for a productive environment can be done by building an app bundle using NPM for the frontend. Backend can be deployed as is using gunicorn or similar WSGI web servers. Reverse proxy such as Nginx can be using to host both frontend and backend on a server and route traffic based on the URL endpoints.
<More to come>
