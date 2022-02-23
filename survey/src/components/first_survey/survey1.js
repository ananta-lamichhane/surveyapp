import React from 'react'
import { useEffect, useState } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import {Survey1_json, recommendations_survey} from '../questionnaires/questionnaire1'
import test from '../questionnaires/testq'
import * as widgets from 'surveyjs-widgets'


/*
    survey page for the recommendations
*/
const RecommendationSurvey = () => {
    widgets.bootstrapslider(Survey);
    var model = new Survey.Model(recommendations_survey)
    model.showCompletedPage= true
    model.showQuestionNumbers = "off"
    model.onUpdatePanelCssClasses
    
    .add(function (survey, options){
        var classes = options.cssClasses
        classes.panel.container += " recom_photos_container";   
    });
    return <div className='recomSurvey'>
       <Survey.Survey
        model = {model}
        onComplete = {(res)=>console.log(res.data)} //TODO: POST to backend
        />
     </div>
}



const MySurvey = () => 
{
    const [surveyDone, setSurveyDone] = useState(false)
    widgets.bootstrapslider(Survey);
    var model2 = new Survey.Model(Survey1_json)
    model2.onGetQuestionTitle.add(function(sender, options){
        console.log("surveytitle")
        console.log(options)
    })

    // do not show the thank you for completing the survey page.
    model2.showCompletedPage = false
    return <div className='mainSurvey'>
        {!surveyDone &&       
        <Survey.Survey
        model = {model2}
        onComplete = {

            // Use fetch API or Axios to send the data to the backend
            (res)=>{console.log(res.data)
            
            // set survey to done so that the recommendation page can be shown
            setSurveyDone(true)
            }   
        }
        /> }

        {/* Display recommendation page if the surveydone state is set to true*/}
        {surveyDone && <RecommendationSurvey />}

    
     </div>

}

export {MySurvey, RecommendationSurvey}