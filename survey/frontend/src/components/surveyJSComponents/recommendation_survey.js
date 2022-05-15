
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



/*Create a model consistent with the already existing survey
which shows the loading recommendation page.
The model does not contain any navigation buttons or questions, just a spinner
with text in form of a HTML component which instructs the participant to wait for the
recommendations
*/
const loadingModelJSON = {
    "title": "Recommender Systems Survey",
    "name": "recSysSurvey",
    "pages": [
        {
            "name": "loadingPage",
            elements:[
                //spinner element along with a text instruction
                {
                    "name": "myhtml",
                    "type": "html",
                    "html": 
                    `
                    <div class='loadingDiv'>
                        <h3>Please wait. Your recommendations are being loaded.</h3>
                        <div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    `
                }
            ]
        }

    ]
}
var loadingSurveyModel = new Survey.Model(loadingModelJSON)
//disable the button
loadingSurveyModel.showNavigationButtons = false


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


    function createImageDivsStringActive(rawData, reclistIndex){
        var i = reclistIndex
        var res = ""

        for( var j=0; j< Math.floor(rawData[i].items.length/2); j++){
            var divString = `
            <div class="col">
                <p id="movieTitleReclist" class="movieTitleReclist"><strong>${rawData[i].items[j].description.title}</strong> </p>
                <img class="img-fluid" src="${rawData[i].items[j].description.poster}"  alt="Image 1"/>
                <div class="overflow-auto carousel-caption d-none d-md-block card">
                    <h6>Director: ${rawData[i].items[j].description.director}</h5>
                    <h6>Actors: ${rawData[i].items[j].description.actors}</h5>
                    <p> ${rawData[i].items[j].description.plot}</p>
                </div>
                </div>
            `

            res = res + divString
        }
       
        return res
    }

    function createImageDivsStringPassive(rawData, reclistIndex){
        var i = reclistIndex
        var res = ""

        for( var j=Math.ceil(rawData[i].items.length/2); j< rawData[i].items.length; j++){
            var divString = `
            <div class="col">
                <p id="movieTitleReclist" class = "movieTitleReclist"><strong>${rawData[i].items[j].description.title}</strong> </p>
                <img class="img-fluid" src="${rawData[i].items[j].description.poster}"  alt="Image 1"/>
                <div class="overflow-auto carousel-caption d-none d-md-block card">
                    <h6>Director: ${rawData[i].items[j].description.director}</h5>
                    <h6>Actors: ${rawData[i].items[j].description.actors}</h5>
                    <p> ${rawData[i].items[j].description.plot}</p>
                </div>
            
                </div>
            `

            res = res + divString
        }
 
        return res
    }

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
                "name": "pageSome",
                "elements":[
                    {
                        "type": "panel",
                        "name": "questionsPanel",
                        "elements":[
                            {
                                "type": "html",
                                "name": "posterCarousel",
                                "title":"Recommendation List 1",
                                "html": `<h5>Please first observe the following recommendation lists
                                        then answer the questions. Click on the buttons to scroll left/right.</h5>`
                            },
                            {
                                "type": "html",
                                "name": "posterCarousel",
                                "title":"Recommendation List 1",
                                "html": 
                                `
                                <h5>Recommendation List 1 </h5>
                                <div id="gallery" class="carousel slide" data-interval="false">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <div class="row">
                                                
                                                ${createImageDivsStringActive(rawData,0)}
                                            </div>
                                        </div>

                                        <div class="carousel-item">
                                            <div class="row">
                                            ${createImageDivsStringPassive(rawData,0)}
                                            </div>
                                        </div>
                                    </div>

                                    <a class="carousel-control-prev" href="#gallery" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>

                                    <a class="carousel-control-next" href="#gallery" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>

                                `
                            },
                            {
                                "type": "html",
                                "name": "posterCarousel",
                                "title":"Recommendation List 1",
                                "html": 
                                `
                                <h5>Recommendation List 2 </h5>
                                <div id="gallery2" class="carousel slide" data-interval="false">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <div class="row">
                                                
                                                ${createImageDivsStringActive(rawData,1)}
                                            </div>
                                        </div>

                                        <div class="carousel-item">
                                            <div class="row">
                                            ${createImageDivsStringPassive(rawData,1)}
                                            </div>
                                        </div>
                                    </div>

                                    <a class="carousel-control-prev" href="#gallery2" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>

                                    <a class="carousel-control-next" href="#gallery2" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>

                                `
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
                   
                ]
            }

            recomSurvey.pages.push(recomPage)
            // for each reclist that is sent (mostly two)
            // iterate in reverese order so we can add each list to the begining of array
           /* for( var i=rawData.length-1; i>=0 ; i--){
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
                

                    var myHtml = `
                    <div class="img_and_card" id="img_and_card">
                    
                        <div class="image_and_text" id="image_and_text">
                            <img  src="${rawData[i].items[j].description.poster}" alt="poster">
                            <h5>${rawData[i].items[j].description.title}</h5>
                                
                        </div>
                        <div class="card card-body" style="width:18rem">
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
           // recomSurvey.pages.push(recomPage)*/
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
      return recomLists? (<div className='mainSurvey'>
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


        </div>):(
        <div className='loadingDivContainer'>
        <Survey.Survey model={loadingSurveyModel}/>
        </div>
)
        
    
}

export default RecomSurvey



    


// issue with race condition in 
// folding back of  the information
// recommendation


// miller number 4-5 items displayed at once 
// attention 
// non-contexualization what is the survey about and contact information
// start with overall statisfaction
// vertical and horizontal
// switch the UI
// fix width of 
// start and next thing
// movie rating based on description
// distance between the UI elements