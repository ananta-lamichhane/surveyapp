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
const axios = require('axios').default
//import RecommendationPageModel from './recommendation_survey.js.js'

//choose from the built in themes of the surveyjs library
Survey
    .StylesManager
    .applyTheme("orange")





/*
    THE SURVEY PAGE FOR RATING INDIVIDUAL MOVIES

*/



// call the create rating function to crate the custom widget
createRatingsWidget()


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

    //stores the parameters after ? in URL, in our case, the token
    const [searchParams] = useSearchParams()
    
    // notifies if the survey (rating items) is done, goes to recommendations then
    const [surveyDone, setSurveyDone] = useState(false) //sets a bool value if the first survey, i.e. questionnaire is done, helps to determine when to show the rcommendations.
    
    //initial data to kick of the survey see welcomePage
    const [welcomePageData, setWelcomePageData] = useState(welcomePage)
    //no. of items to be shown to the participant, sent by the backend upon GET
    const [numItems, setNumItems] = useState()
    //name of the survey, sent by the backend upon GET
    const [surveyName, setSurveyName] = useState("")
    //previous session ratings TODO: see if still necessary
    const [prevRatings, setPrevRatings] = useState()
    //notifies when fetching is done from the backend, only render after that
    const [fetchFinished, setFetchFinished] = useState(false)
    //all data needed to render item of previous session, in format of next item
    const [prevSession, setPrevSession] = useState([{}])
    
    
    //send get request to the questionnaire route of the backend
    /*
    Expect data in this format
    {
        survey_name: "abcd",
        num_items: 10,
        previous_session_items:{
            prev_ratings:{1:1.5, 244:2.0,..},
            next_item: {item_id:4489, description: ..
            }
        }
    }
    see send_survey_details() in questionnaire route
    */
    const getDataFromBackend = async () =>{
        const backendData = await axios.get(process.env.REACT_APP_API_URL + '/questionnaire?token='+searchParams.get('token'))
       console.log(backendData.data)
        setSurveyName(backendData.data.survey_name)
        setNumItems(backendData.data.num_items)
        setPrevRatings(backendData.data.ratings)
        setPrevSession(backendData.data.previous_session_items)
        setFetchFinished(true)
    }

    

     useEffect(() => {
    //first fetch all the data necessary
     var response = getDataFromBackend()
     

    },[])
    
            
    //crate a new SurveyJS survey model with initial data from welcome page
    var model2 = new Survey.Model(welcomePageData)

    //if there's previously rated items, populate them nex to the items
    if(prevRatings){
        model2.data = prevRatings
    }

 



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


    // first render of the survey
    model2.onAfterRenderSurvey.add(function(option){

        for(var i=0; i<numItems; i++){
            //add total number of 'empty' pages 
            model2.addPage(CreateTemplatePage(i+1,numItems))
            model2.pageNextText = "Start"
        }
      
        if(prevSession){


            //if all items were already filled in complete this survey without
            //go directly to recommendation survey
            if (prevSession.length>=numItems){
                alert("You've already finished rating items, you'll be redirected to the recommendations.")
                model2.doComplete()
            }
            // if there was previous session, add all the elements to the survey
            for(var i=0; i<prevSession.length; i++){
                var page = model2.getPage(i+1)
                page.addPanel(CreateNewPanel(prevSession[i]))
            }

            // set current page to the second last page
            model2.currentPageNo = prevSession.length
            // run nextPage to trigger the onCurrentPageChanging (see below)
            // going directly to length+1 does not fetch next item and page is empty
            model2.nextPage()
        }

      
    })



    
    //every time when next is clicked fetches next item and adds it to the end of the list
    
    //keep track of visited page numbers so that data is not fetched twice
    var visited = []

    model2.onCurrentPageChanging.add(function(sender,options){

        // do not fetch on pressing previous
        if (options.isNextPage){
    
            model2.pageNextText = "Next"
        
            
            var val = model2.data
            // currData includes the item ids and ratings for all items rated until now
            var payload = {
                'token': searchParams.get('token'),
                'ratings': val,
            }
            var prevSessionLength = prevSession?prevSession.length:0

            if(model2.currentPageNo+1 < numItems !==1 && model2.currentPageNo+1 > prevSessionLength){
              
                if(!visited.includes(model2.currentPageNo)){
                    
                    PostData(process.env.REACT_APP_API_URL+'/questionnaire', JSON.stringify(payload))
                    .then(data =>{
                        model2.activePage.addPanel(CreateNewPanel(data))
                        model2.activePage.addNewQuestion('customrating', )
                
                        console.log("------------")
                        console.log(data)


                        console.log("------------")
    
                    });
                    
                }
                // add current page to visited pages before going to next one
                visited.push(model2.currentPageNo)
                

            }
            

        }
    
    })

    model2.onComplete.add(function(sender,option){
        PostData(process.env.REACT_APP_API_URL+'/questionnaire', JSON.stringify({
            'token': searchParams.get('token'),
            'ratings': model2.data,
        }))
        .then(data =>{
            console.log("setting survey done")
            setSurveyDone(true)
            console.log(data)

        })
        
    })


     if(fetchFinished ){
        return(
      <div className='mainSurvey'>
        {/* Load the survey only when the survey details have finised fetching
        ie. numItems is populated */}
        
         {!surveyDone &&   
        <Survey.Survey model = {model2}/> } 

        {/* Display recommendation page if the surveydone state is set to true*/}
        {surveyDone &&
        <div>
            {<RecomSurvey />}
        </div>
        }
    
    
     </div>)
     }else{
         return(<div>
             <h5>Hello Loading</h5>
         </div>)
             
         
     }

}

export {MainSurvey}