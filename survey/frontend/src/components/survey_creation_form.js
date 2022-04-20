import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import createRatingsWidget from './ratingWidget'
import WelcomePage from './welcome_page'
import PostData from '../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../utils/create_new_question'
import { useSearchParams } from "react-router-dom";
import { create } from '@mui/material/styles/createTransitions'

export const SurveyCreationForm = () =>{
const [backendData, setBackendData] = useState()
useEffect(() => {
    fetch('http://localhost:5000/survey')
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
                        "name": "Survey name",
                        "isRequired": true,
                    },
                    {
                        type: "comment",
                        name: "Description",
                        title: "Description"
                    },
                    {
                        "type": "dropdown",
                        "name": "dataset",
                        "title": "Dataset",
                        "isRequired": true,
                        "colCount": 0,
                        "hasNone": false,
                        "choices": backendData?(backendData.datasets).map(e => JSON.parse(e).name):[]
                    }


                    ]
                }
            ]
        },
        {   
            //"title": "Offline Evaluation",
            "navigationTitle": "Offline Evaluation",
           // "navigationDescription": "Your feedback",
            "elements":[
                {
                    "type": "radiogroup",
                    "name": "offlineEvalChoice",
                    "title": "Do you want to perform offline evaluation?",
                    "isRequired": true,
                    "colCount": 4,
                    "choices": [
                        "Yes",
                        "No"
                    ]
                },
                {
                    "type": "panel",
                    "name": "placeholder",
                    "visibleIf": "{offlineEvalChoice}='Yes'",
                    "elements":[
                        {
                            "type": "checkbox",
                            "name": "algorithms",
                            "title": "Algorithms",
                            "isRequired": true,
                            "colCount": 4,
                            "choices": algorithms
                        },
                        {
                            "type": "checkbox",
                            "name": "metrics",
                            "title": "Metrics",
                            "isRequired": true,
                            "colCount": 4,
                            "choices": [
                                "RMSE",
                                "MAE",
                                "MSE",
                                "FCP"
                            ]
                        },
                        {
                            "type": "radiogroup",
                            "name": "createRecList",
                            "title": "Do you want to create recommendation lists?",
                            "isRequired": true,
                            "colCount": 4,
                            "choices": [
                                "Yes",
                                "No"
                            ]
                        },
                        {
                            "type": "text",
                            "name": "reclistLength",
                            "title": "Length of Recommendation Lists",
                            "isRequired": true,
                            "visibleIf": "{createRecList} = 'Yes'"
                        }


                    ]
                }
            ]
        },
        {   
           // "title": "Online Evaluation",
            "navigationTitle": "Online Evaluation",
           // "navigationDescription": "Your feedback",
            "elements":[
                {
                    "type": "radiogroup",
                    "name": "onlineEvalChoice",
                    "title": "Do you want to perform onsline evaluation?",
                    "isRequired": true,
                    "colCount": 4,
                    "choices": [
                        "Yes",
                        "No"
                    ]
                },
                {
                    "type": "panel",
                    "name": "placeholder",
                    "visibleIf": "{onlineEvalChoice}='Yes'",
                    "elements":[

                    {
                        "type": "checkbox",
                        "name": "metrics",
                        "title": "Choose recommendation lists to compare",
                        "isRequired": true,
                        "colCount": 4,
                        "choices": algorithms
                    },
                    {
                        "type": "text",
                        "name": "Length of the recommendation lists",
                        "isRequired": false,
                    },


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
                    "name": "choice",
                    "title": "Do you want to invite survey participants now?",
                    "isRequired": true,
                    "colCount": 4,
                    "choices": [
                        "Yes",
                        "No"
                    ]
                },
                {
                    "type": "panel",
                    "name": "placeholder",
                    "visibleIf": "{choice}='Yes'",
                    "elements":[
                    {
                        "type": "text",
                        "name": "Email Subject",
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
             PostData('http://localhost:5000/survey', JSON.stringify(res.data))
             .then(data =>{
                 console.log(data)
             })
             }   
         }/>
    </div>
    )
}