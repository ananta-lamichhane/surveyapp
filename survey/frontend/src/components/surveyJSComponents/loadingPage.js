import { useEffect, useState } from 'react'
import * as Survey from 'survey-react'


/*Create a model consistent with the already existing survey
which shows the loading recommendation page.
The model does not contain any navigation buttons or questions, just a spinner
with text in form of a HTML component which instructs the participant to wait for the
recommendations
Incorporate a timeout, which displays error messages after timeout to contact administrator.
*/

function CreateLoadingPage({message, timeout}){
       
    var loading_html =  `
    <div class='loadingDiv'>
        <h3>Please wait. ${message}.</h3>
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `
    const [isTimeout, setIsTimeout] = useState()
    const [outMessage, setOutMessge] = useState(loading_html)
    useEffect(() => {
        const timer = setTimeout(() => {
            var timeout_html = `
            <div class='loadingDiv'>
            <h3> Timed out. </h3>
            <h3>Could not fetch recommendations, please contact survey adminstrator.</h3>
            <h4> ananta.lamichhane@tu-berlin.de</h4>
            </div>`
            setIsTimeout(true)
            
            setOutMessge(timeout_html)
        }, timeout);
        return () => clearTimeout(timer);
      }, []);



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
                        "html": outMessage
                    }
                ]
            }

        ]
    }
    var loadingSurveyModel = new Survey.Model(loadingModelJSON)
    //disable the button
    loadingSurveyModel.showNavigationButtons = false
    return(
        <div className='mainSurvey'>
             <Survey.Survey model={loadingSurveyModel}/>
        <div className='footer'>
            <h6>&#169; 	Ananta Lamichhane, Technische Universität Berlin</h6>
        </div>
        </div>
       
    )
    
}

export default CreateLoadingPage