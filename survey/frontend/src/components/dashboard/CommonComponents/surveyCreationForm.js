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
        console.log(JSON.parse(data.datasets[0]).id)
        setBackendData(data)
    })
}, [])
var algorithms = ["NormalPredictor", "BaselineOnly", "KNNBasic", "KNNWithMeans", "KNNWithZScore",
    "KNNBaseline", "SVD", "SVDpp", "NMF", "SlopeOne", "CoClustering"]
var templateJSON = {
    "title": "Create and deploy a new survey",
    "name": "recSysSurvey",
    "showProgressBar": "top",
    "progressBarType": "buttons",
    "pages": [
        {
            "navigationTitle": "General Information",
           // "navigationDescription": "Your feedback",
          //  "title": "General Information",
            "elements":[
                {
                    "type": "panel",
                    "name": "placeholder",
                    "elements":[{
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
                        "title": "Item selection strategy",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.strategies.item_selection).map(e => (e)):[]
                    },
                    {
                        "type": "text",
                        "name": "surveyNumParticipants",
                        "title": "Number of participants",
                        "isRequired": true,
                    },
                    {
                        "type": "text",
                        "name": "surveyNumQuestions",
                        "title": "Number of items to be presented",
                        "isRequired": true,
                    }



                    ]
                }
            ]
        },
        {   
           // "title": "Deploy Survey",
            "navigationTitle": "Online Evaluation",
            //"navigationDescription": "Your feedback",
            "elements":[
                {
                    "type": "radiogroup",
                    "name": "onlineEvalChoice",
                    "title": "Do you want to perform online evaluation?",
                    "isRequired": true,
                    "colCount": 4,
                    "choices": [
                        "Yes",
                        "No"
                    ]
                },
                {
                    "type": "panel",
                    "name": "onlineEvalPanel",
                    "visibleIf": "{onlineEvalchoice}='Yes'",
                    "elements":[
                        {
                            "type": "checkbox",
                            "name": "onlineEvalAlgorithms",
                            "title": "Choose algorithms to compare (on the basis of recommendation lists)",
                            "isRequired": true,
                            "colCount": 4,
                            "choices": backendData?(backendData.algorithms).map(e => JSON.parse(e).name):[]
                        }


                    ]
                }
            ]
        },
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
         }
    ]
}

    var CreateNewSurveyModel = new Survey.Model(templateJSON)



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