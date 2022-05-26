import * as Survey from 'survey-react'


/*Create a model consistent with the already existing survey
which shows the loading recommendation page.
The model does not contain any navigation buttons or questions, just a spinner
with text in form of a HTML component which instructs the participant to wait for the
recommendations
*/

function createLoadingPage(message){
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
                            <h3>Please wait. ${message}.</h3>
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

    return loadingSurveyModel
}

export default createLoadingPage