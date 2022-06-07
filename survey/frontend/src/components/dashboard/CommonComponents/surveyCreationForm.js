import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Survey from 'survey-react'


import PostData from '../../../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../../../utils/create_new_question'
import { useSearchParams } from "react-router-dom";
import { create } from '@mui/material/styles/createTransitions'

export const SurveyCreationForm = () =>{
const [backendData, setBackendData] = useState()
useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+'/survey')
    .then(response =>response.json()).then(data =>{
        console.log(data)
        setBackendData(data)
    })
}, [])
var algorithms = ["NormalPredictor", "BaselineOnly", "KNNBasic", "KNNWithMeans", "KNNWithZScore",
    "KNNBaseline", "SVD", "SVDpp", "NMF", "SlopeOne", "CoClustering"]
var templateJSON = {
    "title": "Create a new survey",
    "name": "recSysSurvey",
    //"showProgressBar": "top",
    //"progressBarType": "buttons",
    "pages": [
        {
            "navigationTitle": "General Information",
           // "navigationDescription": "Your feedback",
          //  "title": "General Information",
            "elements":[
                {

                    "type": "panel",
                    "name": "placeholder",
                    "elements":[
                        {"type": "html",
                        "name": "surveyCreationInstructions",
                        "html": `
                                <h5>Please provide the following information to create a survey.<h5>
                                `
                        },
                        {
                        "type": "text",
                        "name": "surveyName",
                        "title": "Survey Name",
                        "isRequired": true,
                    },
                    {
                        type: "comment",
                        name: "surveyDescription",
                        title: "Description"
                    },
                    {
                        "type": "dropdown",
                        "name": "surveyDataset",
                        "title": "Dataset",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.datasets).map(e => JSON.parse(e).name):[]
                    },
                    {
                        "type": "dropdown",
                        "name": "surveyMatchmakingStrategy",
                        "title": "Matchmaking strategy",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.strategies.matchmaking).map(e => (e)):[]
                    },
                    {
                        "type": "dropdown",
                        "name": "surveyItemSelectionStrategy",
                        "title": "Next question selection strategy",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.strategies.item_selection).map(e => (e)):[]
                    },
                    {
                        "type": "panel",
                        "name": "onlineEvalPanel",
                        "elements":[
                            {
                                "type": "checkbox",
                                "name": "onlineEvalReclists",
                                "title": "Choose recommendation lists to compare",
                                "isRequired": true,
                                "colCount": 4,
                                "choices":backendData?(backendData.reclists).map(e => (e)):[]
                            }
    
    
                        ]
                    },
                    {
                        "type": "text",
                        "name": "surveyNumQuestions",
                        "title": "Number of questions (items) in the survey quesionnaire.",
                        "isRequired": true,
                    },
                    {
                        "type": "dropdown",
                        "name": "surveyMailingList",
                        "title": "Choose mailing list to invite participants. Note: Emails will be sent only after you start the survey.",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.mailing_lists).map(e => (e)):[]
                    },



                    ]
                }
            ]
        },
        /*
        {   
            // "title": "Deploy Survey",
             "navigationTitle": "Deploy Survey",
             //"navigationDescription": "Your feedback",
             "elements":[
                 {
                     "type": "radiogroup",
                     "name": "emailChoice",
                     "title": "Do you want to send Email participants now?",
                     "isRequired": true,
                     "colCount": 4,
                     "choices": [
                         "Yes",
                         "No"
                     ]
                 },
                 {
                     "type": "panel",
                     "name": "emailPanel",
                     "visibleIf": "{emailChoice}='Yes'",
                     "elements":[
                     {
                         "type": "text",
                         "name": "emailSubject",
                         "title": "Email Subject",
                         "isRequired": false,
                     },
                     {
                         "type": "comment",
                         "name": "emailBody",
                         "title": "Email Body"
                     },
                     {
                         "type": "file",
                         "title": "Upload the mailing list as CSV",
                         "name": "mailingList",
                         "storeDataAsText": false,
                         "showPreview": false,
                         "maxSize": 102400
                     }
                     
 
 
                     ]
                 }
             ]
         }*/
    ]
}

    var CreateNewSurveyModel = new Survey.Model(templateJSON)

  
    CreateNewSurveyModel.onValidateQuestion.add(function(survey, options){
        //the question to select recommendation list
        if(options.name === "onlineEvalReclists") {
        
        // allow at max 2 values to be selected
        // error displays only after submission and not inline
        if(options.value && options.value.length > 2) {
            //Set the error
            options.error = "Please select maximum two values"; 
        }
        }
    });

    return (
        <div>
        <Survey.Survey model={CreateNewSurveyModel} 
        onComplete = {
            res=>{
             // set survey to done so that the recommendation page can be shown
             console.log(res.data)
             PostData(process.env.REACT_APP_API_URL +'/survey', JSON.stringify(res.data))
             .then(data =>{
                 Navigate("/")
             })
             }   
         }/>
    </div>
    )
}