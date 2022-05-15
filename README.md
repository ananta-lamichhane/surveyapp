# A Hybrid Evaluation Scheme for Making Qualitative Feedback Available to Recommender Systems Researchers

### Easily conduct user studies and offline evaluations for recommender systems research

## Introduction

## Getting Started
### Prerequisites
A windows / linux system with Python 3.10 and pip for the backend and Node Package Manager (npm) and NodeJS must be installed for the frontend.

### Installation
This project uses react JS for frontend ans Python Flask as backend / API. To customize and make changes to the project before deployment, following steps are necessary:
1. Clone the repository.
2. Install backend 
3. Install frontend

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

