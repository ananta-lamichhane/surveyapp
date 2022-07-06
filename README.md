# A Hybrid Evaluation Scheme for Making Qualitative Feedback Available to Recommender Systems Researchers

### Easily conduct user studies and offline evaluations for recommender systems research

## Introduction

## Getting Started

### Prerequisites
A computer with linux or windows with Python 3.10 and pip for the backend and Node Package Manager (npm) and NodeJS must be installed for the frontend. The code was tested with a Ubuntu 20.04 server with Python 3.10 installed.
Check if the necessary requirments are installed as follows.
#### Checking python, NodeJS and pip version
Open a bash terminal (linux) or command prompt / powershell terminal (windows) and type the following commands to show the current versions of the installed applications. If not installed, the commands won't produce any output.
- Python: `python --version`
- Pip: `pip --version`
- NodeJS: `node --version`
- Python venv: `python3 -m venv -h`

If not already installed, follow the official documentations to get and install.
- Python: https://wiki.python.org/moin/BeginnersGuide
- Pip: https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line
- NodeJS: https://nodejs.org/en/download/
- Python venv: `apt -y install python3-venv`

Note: Some python packages like surprise produce an error while installing. For this, you may need to install some additional packages like build esssential and pyhton3.x-dev. A discussion on stackoverflow is found [here](https://stackoverflow.com/questions/26053982/setup-script-exited-with-error-command-x86-64-linux-gnu-gcc-failed-with-exit). Especially the aforementioned two packages are crucial.



## Directory structure
The project is divided into two independent parts. The frontend directory consists of all files and data pertaining to the web application components while the backend directory contains all data (datasets, recommendation lists, evaluation results and artefacts.) and API functionality.
### Backend
#### data
The data directory contains the datasets, recommendation lists for online evaluations and the results generated from the online and offline evaluation in datasets, recommendation_lists and results directories respectively.


#### src
The src folder contains all source code for the API built up using Flask in python.

### Frontend
The frontend directory resembles a directory structure created automatically by create-react-app. All react components related to the survey frontend are located in the src/components directory.

## Installation
This project uses react JS for frontend ans Python Flask as backend / API. To customize and make changes to the project before deployment, following steps are necessary. Note that the instructions are based on the default working directory being ./surveyapp/survey.
### Installation via script
The accompanying script in survey directory automates the process and automatically takes the following actions.
1. Copies over the necessary files from backend/examples directory to appropriate places in backend/data.
2. Creates and activates a python virtual environment.
3. Installs necessary python moduls from backend/src/requirements.txt
4. Runs the flask API server in background on port 5000.
5. Checks if the API server is on and stops if the server is not on.
6. Install necessary node modules in frontend/node_modules automatically. The modules are specified by frontend/package.json
7. Runs the web app on port 3000.
8. Waits for the web-app to initialize, checks if it's running and exits on pressing any button.

Make sure the script is executible before running.\
`chmod +x run_and_test.sh`
Run the script using:\
`source run_and_test.sh`

TIP: You can fill in the backend/examples directory with the actual files you want to add and run the script to automatically deploy your custom survey.

### Detailed installation instructions
#### 1. Clone the repository.
`git clone https://github.com/ananta-lamichhane/surveyapp.git`
#### 2. Install backend 
1. Change to the default working directory of the cloned repo.\
`cd surveyapp/survey`
2. Create a python virtual environment\
`python3 -m venv venv`
3. Activate the virtual environment \
`source venv/bin/activate`
4. Install the requirements from requirements.txt file.\
`pip install -r backend/src/requirements.txt`
5. Serve the application on port 5000.
- On Linux using [gunicorn](https://gunicorn.org/#docs).\
`gunicorn --bind 0.0.0.0:5000 backend.src.app:app`
- On windows using [waitress](https://docs.pylonsproject.org/projects/waitress/en/latest/runner.html).\
 `waitress-serve --port=5000 backend.src.app:app` \
NOTE: Do not use `flask run` because it doesn't recognize the app in the subdirectory and messes up the directory struture in the application.
6. Running server in the background.\
  The server will stop if you close the terminal / cmd session.
  If you're using ssh, the server ends when you close the ssh session.\n
  To run the server in background, use `--daemon` argument at the end of command in 5.
  
#### 3. Install frontend
1. Make sure NodeJS is installed. Use official documentation (see prerequisites).
2 Install necessary modules.\ 
`npm install`
3. Start the node server on (defualt) port 3000.\
`npm start --prefix frontend` 
4. Running in background.\
Similar to running the API server, you'll find closing the bash / command prompt terminal will kill the application too. However,
node does not natively support running the application in background. You can use tools like [pm2](https://www.npmjs.com/package/pm2) to run the application in backend. Use [this medium article]([https://www.npmjs.com/package/pm2](https://medium.com/idomongodb/how-to-npm-run-start-at-the-background-%EF%B8%8F-64ddda7c1f1) for an overview on using pm2.

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
### Adding your own next question selection strategy.
Say you want to have your own logic in place where you select the next item to be rated by the participant based on current ratings and some other criteria (e.g. same genre movies, one of the most popular movies, same director, etc.)\
 This can be achieved by implementing the abstract class Strategy in src/strategies/item_selection/abstract_class/item_selection_base.py
 Make sure the implemented class is named Strategy and is placed inside the src/strategies/item_selection directory.\
 When implemented correctly, the new strategy returns the next item that should be displayed to the participant based on your desired logic.
 
### Adding your own matchmaking strategy.
 After a participant has rated all the items (questions), you now want to find out which user in the dataset (offline user) is most similar to the given online user. This can be chosed using various algorithms and strategies. By instantiating the abstract class MatchmakingBase in src/strategies/matchmaking/abstract_class/matchmaking_strategy_base.py
 
### Changing the survey questionnaire.
 You can change the questions displayed to a participant by editing the JSON templates that are placed in frontend/src/components/surveyJSTemplateJSONS.
 This allows the survey creator to change what questions they want to ask, what kind of input they want (slider, input box, stars, emojis, etc.), the range of the input and what they're called.
 
### Changing item descriptions.
 This repo uses MovieLens dataset as default and uses the attributes of a movie to create a description so that a participant can have more information about the displayed item. The function create_item_descriptions() in backend/src/utils/create_item_descriptions.py can be edited to fit your dataset. This should be paired with corresponding changes on the frontend. Especially while creating item description in CreateNewPanel() of frontend/utils/create_new_question.js and in the helper functions in frontend/src/components/surveyJSComponents/recommendation_survey.js
 
## Deployment
Deployment for a productive environment can be done by building an app bundle using NPM for the frontend. Backend can be deployed as is using gunicorn or similar WSGI web servers. Reverse proxy such as Nginx can be using to host both frontend and backend on a server and route traffic based on the URL endpoints.
<More to come>

## Troubleshooting
### Killing and restarting
Since the applications run on the background in shell, it may be difficult to close these, free up the ports they're occupying (ports 3000 and 5000) and restart them. \\
To restart the API, do the following: \\
1. On shell terminal, type the command `sudo netstat -nltp`.\\
You'll get a list of processes with their IDs, names and ports they're occupying.\\
2. Next, find out the process IDs with process name python port 5000 and type `sudo kill -9 <processID>` to kill the API process.
3. Follow install instruction above to start the API again.

To restart the web application follow the same steps above but with process name "node" and port 3000.

