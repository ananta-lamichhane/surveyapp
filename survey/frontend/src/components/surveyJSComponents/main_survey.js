import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import createRatingsWidget from '../customWidgets/ratingWidget'
import WelcomePage from '../surveyJSTemplateJSONS/welcome_page'
import PostData from '../../utils/postdata'
import {CreateNewQuestion, CreateTemplatePage, CreateNewPanel} from '../../utils/create_new_question'
import { useSearchParams } from "react-router-dom";
import RecomSurvey from "./recommendation_survey"
//import RecommendationPageModel from './recommendation_survey.js.js'

//choose from the built in themes of the surveyjs library
Survey
    .StylesManager
    .applyTheme("orange")

// call the create rating function to crate the custom widget



/*
    THE SURVEY PAGE FOR RATING INDIVIDUAL MOVIES

*/
createRatingsWidget()
//TODO fetch it from the backend (admin dashboard)
var qnr=1
var max_items = 5
var curr_item = 10
const MainSurvey =  () => 

{
    

   //welcome page on the main survey
    var welcomePage = {
        "title": "Recommender Systems Survey",
        "name": "recsysSurvey",
        "pages": [
              WelcomePage("Recommender System Survey")
        ]
    }

    const [searchParams] = useSearchParams()
    const [surveyDone, setSurveyDone] = useState(false) //sets a bool value if the first survey, i.e. questionnaire is done, helps to determine when to show the rcommendations.
    const [allData, setAllData] = useState(welcomePage)
    const [numItems, setNumItems] = useState()
    const [surveyName, setSurveyName] = useState("")

     useEffect(() => {
        fetch('http://localhost:5000/questionnaire?token='+ searchParams.get('token'))
        .then(response =>response.json()).then(data =>{
            setNumItems(data.num_items)
         //   setSurveyName(data.survey_name)
            
        })
    }, [])

    var model2 = new Survey.Model(allData)


    model2.showQuestionNumbers = "true"
    // do not show the thank you for completing the survey page.
    model2.showCompletedPage = false

        //custom naming of the css classes
    model2.onUpdatePanelCssClasses.add(function (survey, options){
          //  console.log("current page no from update classes: "+ model2.currentPageNo)

            var classes = options.cssClasses
            if(model2.currentPageNo !== 0){
                classes.panel.container += " pic_and_description_container";
             
            }else{
                var next = document.getElementsByClassName('sv_next_btn')
                console.log(next)
            }
          
    })

    // use this function to load initial values into the survey


    //supply initial values to the survey should be done before first render


    /* While the survey is rendering for the first time, create template pages
        Where the only information is Item <i> out of <totalitems>.
    */
    model2.onAfterRenderSurvey.add(function(e){
        for(var i=0; i<numItems; i++){
            //add total number of 'empty' pages 
            console.log("adding "+numItems+" pages")
            model2.addPage(CreateTemplatePage(i+1,numItems))
            model2.pageNextText = "Start"
        }
    })


    //every time when next is clicked fetches next item and adds it to the end of the list
    model2.onCurrentPageChanging.add(function(e){
        model2.pageNextText = "Next"
        var val = model2.data
        // currData includes the item ids and ratings for all items rated until now
        var payload = {
            'token': searchParams.get('token'),
            'ratings': val,
        }

        if(model2.currentPageNo+1 < max_items !==1){
            console.log("current page number" + (model2.currentPageNo+1))
             PostData('http://localhost:5000/questionnaire', JSON.stringify(payload))
            .then(data =>{
                model2.activePage.addPanel(CreateNewPanel(data,2,10))
                model2.activePage.addNewQuestion('customrating', )
                //model2.addPage(CreateNewQuestion(data, (model2.currentPageNo+1), max_items))
                console.log("------------")
                console.log(data)
                console.log("------------")

            });
             
        
    }
        
    
    }) 
        var surveyValueChanged = function (sender, options) {
            var el = document.getElementById(options.name);
            if (el) {
                el.value = options.value;
            }
        };

    /*
        Example of prepopulated data (if we need to reload the data from backend 
        after a survey was broken off prematurely)
    model2.data = {
        'movie: 1': 2.5,
        'movie: 2': 3.5,
        'movie: 3': 1.0,
        'movie: 4': 5
    }
    */




 

    return <div className='mainSurvey'>
        {/* Load the survey only when the survey details have finised fetching
        ie. numItems is populated */}
        
         {!surveyDone &&  (numItems >0) &&   
        <Survey.Survey
        model = {model2}
        onComplete = {
           res=>{
            // set survey to done so that the recommendation page can be shown
            setSurveyDone(true)
            }   
        }
        onValueChanged={surveyValueChanged}
    /> } 

        {/* Display recommendation page if the surveydone state is set to true*/}
        {surveyDone &&
        <div>
            {<RecomSurvey />}
        </div>
        }
    
    
     </div>

}

export {MainSurvey}