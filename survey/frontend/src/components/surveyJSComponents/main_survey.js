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
import createLoadingPage from './loadingPage'
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
    const [prevSession, setPrevSession] = useState()
    //keep track of visited page numbers so that data is not fetched twice
    var visited = []
    
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

    
   //model2.onAfterRenderSurvey.add(function(option){
    if(fetchFinished && !surveyDone){
        console.log("adding pages")
        for(var i=0; i<numItems; i++){
            //add total number of 'empty' pages 
            model2.addPage(CreateTemplatePage(i+1,numItems))
           
            model2.pageNextText = "Next"
        }

        console.log(prevSession)
      
        if(prevSession){
            //if all items were already filled in complete this survey without
            //go directly to recommendation survey
            if (prevSession.length>=numItems){
                alert("You've already finished rating items, you'll be redirected to the recommendations.")
                model2.doComplete()
                setSurveyDone(true)
            }
            // if there was previous session, add all the elements to the survey
            visited.push(0)
            for(var i=0; i<prevSession.length; i++){
                visited.push(i+1)
                var page = model2.getPage(i+1)
                // create a panel with item description, poster and ratins.
                page.addPanel(CreateNewPanel(prevSession[i]))
                //since itemid is question name too we'll need to keep track of it
                var itemId = (prevSession[i].next_item.item_id)
                //find the rating question on the page
                var q = page.getQuestionByName(itemId)
                // remove the question with ratings so as not to let user rate twice
                page.removeQuestion(q)
         
                

                // create a new html with info about the already rated item
                var newQ = new Survey.Question()
                console.log(prevSession[i].current_ratings[''+itemId])
                newQ.fromJSON(  {
                    "type": "html",
                    "title": ` 
                    ${(model2.data)[itemId] === "-1"?"You skipped this item by clicking 'don't know'": "You rated this item "+(model2.data)[itemId] }
                    `,
                    "html":"<p>Testtesttesttest</p>"
                })
                // find the panel which contained the ratings previously (only one on the page)
                var panel = page.getPanels()[0]
                
            // add the info that the user already rated the item to where the rating was before.
              panel.addQuestion(newQ, -1)
            }

            // set current page to the second last page
            model2.currentPageNo = prevSession.length
            // run nextPage to trigger the onCurrentPageChanging (see below)
            // going directly to length+1 does not fetch next item and page is empty
            console.log("go to next page")
            var r = model2.nextPage()
            var val = model2.data
            var payload = {
                'token': searchParams.get('token'),
                'ratings': val,
            }
             PostData(process.env.REACT_APP_API_URL+'/questionnaire', JSON.stringify(payload))
            .then(data =>{
                model2.activePage.addPanel(CreateNewPanel(data))
                model2.activePage.addNewQuestion('customrating', )
        
                console.log("------------")
                console.log(data)


                console.log("------------")

            }); 

        }

    }
    //})



    model2.onCurrentPageChanging.add(function(sender,options){

        //triggered when previous is pressed.
        // do not do anything if it's the welcome page.
        if (options.isPrevPage && model2.currentPageNo!==1){
            
            //newCurrentPage is the one which comes up AFTER pressing previous
            var page = options.newCurrentPage
           
            var q = page.questions.at(-1)

            //if the question is {itemId:rating}, the value should exist
            if(q.value){
            // remove the question with ratings so as not to let user rate twice
            page.removeQuestion(q)
            

            // create a new html with info about the already rated item
            var newQ = new Survey.Question()
            newQ.fromJSON(  {
                "type": "html",
                "name": ` 
                ${q.value==="-1"?"You skipped this item by clicking 'don't know'":"You rated this item "+q.value} }
                `,
                "html":""
               
            })
            // find the panel which contained the ratings previously (only one on the page)
            var panel = page.getPanels()[0]
            if(panel){
                panel.addQuestion(newQ, -1)
            }
            
        // add the info that the user already rated the item to where the rating was before.
         
        }

        }

        // do not fetch on pressing previous
        if (options.isNextPage){
            console.log("next page")
    
            model2.pageNextText = "Next"
        
            
            var val = model2.data
            console.log("data = ")
            console.log(val)
            // currData includes the item ids and ratings for all items rated until now
            var payload = {
                'token': searchParams.get('token'),
                'ratings': val,
            }
            var prevSessionLength = prevSession?prevSession.length:0

            //if(model2.currentPageNo < numItems && model2.currentPageNo+1 > prevSessionLength){
              
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
                

            //}
            

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


        //wait until post request has finished fetching data
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
         //if the fetching has not finished yet show the loading page
         return((

            <div className='loadingDivContainer'>
            <Survey.Survey model={createLoadingPage("Fetching items.")}/>
            </div>))
             
         
     }

}

export {MainSurvey}