import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Survey from 'survey-react'
import PostData from '../../../utils/postdata'
import { useSearchParams } from "react-router-dom";
import { create } from '@mui/material/styles/createTransitions'

export const OfflineEvalCreationForm = () =>{
const [backendData, setBackendData] = useState()
useEffect(() => {
    fetch(process.env.REACT_APP_API_URL +'/survey')
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
    "pages": [
         {   
            //"title": "Offline Evaluation",
            "navigationTitle": "Offline Evaluation",
           // "navigationDescription": "Your feedback",
            "elements":[
                {
                    "type": "panel",
                    "name": "placeholder",
                  //  "visibleIf": "{offlineEvalChoice}='Yes'",
                    "elements":[
                        {
                            "type": "text",
                            "name": "offlineEvalName",
                            "title": "Friendly Name for the Evaluation",
                            "isRequired": true,
                           // "visibleIf": "{createRecList} = 'Yes'"
                        },
                        {
                            "type": "dropdown",
                            "name": "offlineEvalDataset",
                            "title": "Choose dataset",
                            "isRequired": true,
                            "colCount": 0,
                            "hasNone": false,
                            "choices": backendData?(backendData.datasets).map(e => JSON.parse(e).name):[]
                        },
                        {
                            "type": "checkbox",
                            "name": "offlineEvalAlgorithms",
                            "title": "Choose Algorithms",
                            "isRequired": true,
                            "colCount": 4,
                            "choices": algorithms
                        },
                        {
                            "type": "checkbox",
                            "name": "offlineEvalMetrics",
                            "title": "Choose metrics",
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
                            "type": "text",
                            "name": "reclistLength",
                            "title": "Length of Recommendation Lists",
                            "isRequired": true,
                           // "visibleIf": "{createRecList} = 'Yes'"
                        }


                    ]
                }
            ]
        }
    ]
}

    var CreateNewOfflineEvalModel = new Survey.Model(templateJSON)



    return (
        <div>
        <Survey.Survey model={CreateNewOfflineEvalModel} 
        onComplete = {
            res=>{
             // set survey to done so that the recommendation page can be shown
             console.log(res.data)
             PostData(process.env.REACT_APP_API_URL+'/offline_eval', JSON.stringify(res.data))
             .then(data =>{
                 Navigate("/")
             })
             }   
         }/>
    </div>
    )
}