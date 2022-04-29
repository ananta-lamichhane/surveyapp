
import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import createRatingsWidget from '../customWidgets/ratingWidget'
import WelcomePage from '../surveyJSTemplateJSONS/welcome_page'
import PostData from '../../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../../utils/create_new_question'
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
        fetch(process.env.REACT_APP_API_URL+'/recommendation?token='+ searchParams.get('token'))
        .then(response =>response.json()).then(data =>{
            setRecomLists(createRecomElements(data))
           // console.log(data)  
           // console.log(data[0].items[1].description.poster)  
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
                        "title": "Question about diversity?",
                        "isRequired": true,
                        "mininumRateDescription": "Lowest",
                        "maximumRateDescription": "Highest"
                    }, {
                        "type": "rating",
                        "name": "novelty",
             
                        "title": "Question about novelty?",
                        "mininumRateDescription": "Lowest",
                        "maximumRateDescription": "Highest"
                    },
                    {
                        "type": "rating",
                        "name": "serendipity",
             
                        "title": "Question about serendipity?",
                        "mininumRateDescription": "Lowest",
                        "maximumRateDescription": "Highest"
                    },
                    {
                        "type": "rating",
                        "name": "utility",
             
                        "title": "Question about utility?",
                        "mininumRateDescription": "Lowest",
                        "maximumRateDescription": "Highest"
                    },
                    {
                        "type": "rating",
                        "name": "unexpectedness",
             
                        "title": "Question about unexpectedness?",
                        "mininumRateDescription": "Lowest",
                        "maximumRateDescription": "Highest"
                    }
                ]
            }
            
        
            for( var j=0; j< rawData[i].items.length; j++){
                console.log("rawdata count" + j)
                var itemDescription = {
                                    "type": "html",
                                    "name": "myhtml",
                                    "html": `
                                    <div class="card" style="width: 10rem;">
                                        <img src="${rawData[i].items[j].description.poster}" class="card-img-top" alt="movie poster">
                                        <div class="card-body">
                                            <h5 class="card-title">${rawData[i].items[j].description.title}</h5>
                                        </div>
                                        <ul class="list-group list-group-flush">
                                        <li class="list-group-item">Year:${rawData[i].items[j].description.year}</li>
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
     return <div className='mainSurvey'>
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



    
