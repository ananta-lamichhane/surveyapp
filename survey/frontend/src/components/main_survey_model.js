import WelcomePage from './welcome_page'
import createRatingsWidget from './ratingWidget'
import {useState } from 'react'
import PostData from '../utils/postdata'
import {CreateNewQuestion, CreateNewPanel} from '../utils/create_new_question'
import { useSearchParams } from "react-router-dom";
import 'survey-react/survey.css'
import * as Survey from 'survey-react'


const MainSurveyModel =  () => 


{
    var qnr=1
    var max_items = 3
    var curr_item = 10
    createRatingsWidget()
    
    const [searchParams] = useSearchParams()
    const [surveyDone, setSurveyDone] = useState(false) //sets a bool value if the first survey, i.e. questionnaire is done, helps to determine when to show the rcommendations.

    // main framework for the display contains only title and placeholder for pages
    var welcomePage = {
        "title": "Recommender Systems Survey",
        "name": "recsysSurvey",
        "pages": [
              WelcomePage()
        ]
    }

    const [allData, setAllData] = useState(welcomePage)
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
            }
          
    })

    // use this function to load initial values into the survey
    var surveyValueChanged = function (sender, options) {
        var el = document.getElementById(options.name);
        if (el) {
            el.value = options.value;
        }
    };

    //supply initial values to the survey should be done before first render


    // on first render fetches the first item from the backend and adds it at the end of the list
    //start of the survey provides additional information
    // total number of questions, etc.
      model2.onAfterRenderSurvey.add(function(e){
         var tok = searchParams.get('token')
        fetch('http://localhost:5000/questionnaire?token='+tok).then(res => res.json()).then(data =>{
            model2.addPage(CreateNewQuestion(data, qnr, max_items))
            curr_item = data.item_id
           // qnr++
        })
    })




    //every time when next is clicked fetches next item and adds it to the end of the list
    model2.onCurrentPageChanging.add(function(e){
        console.log("current qnr: " + (model2.currentPageNo+1) + "current max: "+ max_items )
        console.log("page change .....")
        // currData includes the item ids and ratings for all items rated until now
        var payload = {
            'token': searchParams.get('token'),
            'ratings': model2.data
        }
        // TODO: Send this as a post to the backend
        if(model2.currentPageNo+1 < max_items){
             PostData('http://localhost:5000/questionnaire', JSON.stringify(payload))
            .then(data =>{
                model2.addPage(CreateNewQuestion(data, (model2.currentPageNo+1), max_items))
            });
             
        
    }
        
    
    })

    return model2

}

export default MainSurveyModel