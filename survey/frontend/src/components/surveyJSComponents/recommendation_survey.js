
import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import createRatingsWidget from '../customWidgets/ratingWidget'
import WelcomePage from '../surveyJSTemplateJSONS/welcome_page'
import PostData from '../../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../../utils/create_new_question'
import { useSearchParams } from "react-router-dom";



/*
    THE SURVEY PAGE FOR RATING RECOMMENDATION PAGES

*/
createRatingsWidget()


const RecomSurvey =  () => {

    // saves the query parameters of get requests, especially used to get and pass the token
    const [searchParams] = useSearchParams()

    // save the recommendation lists (description of individual items as an array)
    const [recomLists, setRecomLists] = useState()
    const [reclistFilenames, setReclsitFilenames] = useState([])
    const [offlineUserId, setOfflineUserId] = useState()
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL+'/recommendation?token='+ searchParams.get('token'))
        .then(response =>response.json()).then(data =>{
            setRecomLists(createRecomElements(data))
        })
    }, [])


    /*
    CREATE INDIVIDUAL PAGE ELEMENTS AFTER RECEIVING THE JSON DATA FROM THE BACKEND
    */

    function createRecomElements(rawData){
        console.log("rawData is")
        console.log(rawData)
        // first create a container for all the pages
        // if each reclist needs a page of its own we'll need multiple pages
        setOfflineUserId(rawData[0]['offline_user_id'])
        
        var recomSurvey = {
            "title": "Recommender Systems Survey",
            "name": "recSysSurvey",
            "pages": []
        }

        // recomPage represents a single page of the reclist survey
        // it can either contain single reclist and questionnaire related to the questionnaire
        // or all reclists at once and questionnaire at last, the former is implemented here
          var  recomPage = {
              // (subjective rating questions about the reclist (s))
                "name": "page" + i,
                "elements":[
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

            recomSurvey.pages.push(recomPage)
            // for each reclist that is sent (mostly two)
            // iterate in reverese order so we can add each list to the begining of array
            for( var i=rawData.length-1; i>=0 ; i--){
                console.log("filename = "+ rawData[i].reclist_filename)
                setReclsitFilenames(reclistFilenames => [rawData[i].reclist_filename,...reclistFilenames ])
            // create a template html with images and movie title in a div to overcome
            // surveyjs challenges
            //<button class="scroll_right_button" id="scroll_right_btn_${i+1}" onclick="document.getElementById('question_${i+1}').scrollLeft+=window.innerWidth">Scroll Right</button>

            var template = `
            <div class="reclist_with_title">
            <h3>Recommendation List ${i+1}</h3>
            <div class=poster_container>
            `

            // loop through all the movies ad create hmtl div with relevant infos
            for( var j=0; j< rawData[i].items.length; j++){

                    var myHtml = `<div class="image_and_text" id="image_and_text"> 
                   
                    
                    
                        <a class="textButton" title="Click to show more information" data-toggle="collapse" href="#collapseExample${i}_${j}" role="button" aria-expanded="false" aria-controls="collapseExample${i}_${j}">
                        <img src="${rawData[i].items[j].description.poster}" alt="poster" width="150px", height="auto">
                            ${rawData[i].items[j].description.title}
                            
                        </a>

                        
                    </div>
                        <div class="collapse" id="collapseExample${i}_${j}">
                        <div class="card card-body">
                            <h5>Director: ${rawData[i].items[j].description.director}</h5>
                            <h5>Actors: ${rawData[i].items[j].description.actors} </h5>
                            <h5>Genres: ${rawData[i].items[j].description.genre} </h5>
                            <p>${rawData[i].items[j].description.plot} </p>
                        </div>
                        </div>
                    `
                    template = template + myHtml
                }
                template = template + '</div> </div>'
               // console.log(template)
                var reclist_a_posters = {
                    "type": "panel",
                    "name": "images_and_desc_panel",
                    "elements":[
                        {
                        "id": `reclist${i}`,
                        "type" : "html",
                        "name": `images${i}`,
                        "html": template
                        }
                    ]
                }

                // add newly created reclist div to the first of the list
                recomPage.elements.unshift(reclist_a_posters)
            }
            var instruction = {
                "type": "panel",
                "name": "instruction_to_rate",
                "elements":[
                    {
                    "type" : "html",
                    "name": `images${i}`,
                    "html": `<h4>Please answer the questions after observing the rcommendation lists below. Click on the images to display more information about the movie</h4>`
                    }
                ]
            }

            recomPage.elements.unshift(instruction)

            // then add this page to the whole survey (mostly relevant if multiple pages)
           // recomSurvey.pages.push(recomPage)
    return recomSurvey
    }



    var recommendationSurveyModel = new Survey.Model(recomLists)
    recommendationSurveyModel.onUpdatePanelCssClasses.add(function (survey, options){
          var classes = options.cssClasses
            // add custom name to the css classes to customize
            classes.panel.container += " recom_pic_and_description";
           

        
  })

  // surveyjs creates dynamic random ids for the questions, need to make them static
  // e.g. to apply css and onclick events (click to expand, scroll right, etc. see html objects above)
  var allq= recommendationSurveyModel.getAllQuestions()
  allq.forEach((question, index) => {

    // change ids to "question_i"
      question.id = "question_" + index

  });
     return <div className='mainSurvey'>
        <div>
            <Survey.Survey model={recommendationSurveyModel} 
            onComplete = {
                res=>{
                
                var payload = {
                    'offline_user_id': offlineUserId,
                    'reclist_filenames': reclistFilenames,
                    'token': searchParams.get('token'),
                    'ratings': res.data
                }
                 // set survey to done so that the recommendation page can be shown
                 console.log(payload)
                 console.log(reclistFilenames)
                 PostData(process.env.REACT_APP_API_URL+'/recommendation', payload).then(res =>{
                     console.log(res)
                 })
                 }   
             }/>
        </div>


        </div>
        
    
}

export default RecomSurvey



    
