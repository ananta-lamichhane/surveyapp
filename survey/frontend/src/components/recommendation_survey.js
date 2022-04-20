
import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import createRatingsWidget from './ratingWidget'
import WelcomePage from './welcome_page'
import PostData from '../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../utils/create_new_question'
import { useSearchParams } from "react-router-dom";



//import RecommendationPageModel from './recommendation_survey.js.js'

//choose from the built in themes of the surveyjs library


// call the create rating function to crate the custom widget



/*
    THE SURVEY PAGE FOR RATING INDIVIDUAL MOVIES

*/
createRatingsWidget()


const RecomSurvey =  () => {


    const [searchParams] = useSearchParams()
    const [recomLists, setRecomLists] = useState()
    useEffect(() => {
        fetch('http://localhost:5000/recommendation?token='+ searchParams.get('token'))
        .then(response =>response.json()).then(data =>{
            setRecomLists(createRecomElements(data))
            console.log(data)    
        })
    }, [])

    function createRecomElements(rawData){
        var recomSurvey = {
            "title": "Recommender Systems Survey",
            "name": "recSysSurvey",
            "pages": []
        }
        
        for(var i=0; i< rawData.length; i++){
          var  recomPage = {
              
                "name": "page" + i,
                "elements":[
                    {
                        "type": "panel",
                        "name": "mypanel1",
                        "elements":[]
                    },
                    {
                        "type": "rating",
                        "name": "satisfaction",
                        "title": "How satisfied are you with the Product?",
                        "isRequired": true,
                        "mininumRateDescription": "Not Satisfied",
                        "maximumRateDescription": "Completely satisfied"
                    }, {
                        "type": "rating",
                        "name": "recommend friends",
             
                        "title": "How likely are you to recommend the Product to a friend or co-worker?",
                        "mininumRateDescription": "Will not recommend",
                        "maximumRateDescription": "I will recommend"
                    }
                ]
            }
            
        
            for( var j=0; j< rawData[i].items.length; j++){
                console.log("rawdata count" + j)
                var itemDescription = {
                                    "type": "html",
                                    "name": "myhtml",
                                    "html": `
                                    <div class="card" style="width: 16rem;">
                                        <img src="${rawData[i].items[j].description.poster}" class="card-img-top" alt="movie poster">
                                        <div class="card-body">
                                            <h5 class="card-title">${rawData[i].items[i].description.title}</h5>
                                        </div>
                                        <ul class="list-group list-group-flush">
                                        <li class="list-group-item">Year:${rawData[i].items[i].description.year}</li>
                                        </ul>
                                        <div class="card-body">
                                            <a href="#" class="card-link">IMDB Page</a>
                                            <a href="#" class="card-link">Another link</a>
                                        </div>
                                    </div>  
                                    `
                                }
                    recomPage.elements[0].elements.push(itemDescription)
                     
                
            }

            var surveyQuestions = {
 
            }
            recomSurvey.pages.push(recomPage)
        
       
    }
    console.log('recomsurvey')
    console.log(recomSurvey)
    return recomSurvey
    }

    var recommendationSurveyModel = new Survey.Model(recomLists)
    recommendationSurveyModel.onUpdatePanelCssClasses.add(function (survey, options){
        //  console.log("current page no from update classes: "+ model2.currentPageNo)

          var classes = options.cssClasses

            classes.panel.container += " recom_pic_and_description";
           

        
  })
     return recomLists && <div className='mainSurvey'>
        <div>
            <Survey.Survey model={recommendationSurveyModel} 
            onComplete = {
                res=>{
                 // set survey to done so that the recommendation page can be shown
                 console.log(res.data)
                 }   
             }/>
        </div>


        </div>
        
    
}

export default RecomSurvey



    
