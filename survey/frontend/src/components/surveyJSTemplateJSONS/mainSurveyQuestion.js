

/*
Helps to set the questions ralated to the main survey.
SurveyJS provides with different question types and input methods and ranges

visit: https://surveyjs.io/Examples/Library/?id=questiontype-text&platform=Reactjs&theme=defaultV2
for more detail.


You can change the way the items are displayed by chaning the items here.

returns: a JSON with the a question with its description and a rating scale.
parameters: imageURL, URL pointing to the item poster/book cover/ or descriptive image,
            itemDescription: A HTML Snippet with desired description of the item.
            itemId: itemID sent by the backend API.
*/

var MainSurveyQuestion = (imageURL, itemDescription,itemId) =>{
    var newPanel = {

        "type": "panel",
        "innerIndent": 1,
        "name": "panel",
    // "state": "expanded",
       
        "elements": [
            // poster of the given movie

            {
                "type": "image",
                "name": "banner",
                "imageLink": imageURL,
             //   "imageWidth": "300px",
              //  "imageHeight": "400px",
            },

            // description of the given movie
            {
                "type": "html",
                "name": "info",
                "html": itemDescription
            },

            //widget to input ratings from the user. You can change the type of the widget
            // use examples below to try out other alternatives.
            {
                "type": "customrating",
               // "visibleIf":"{rating} empty",
                "name": itemId,
                "title": "Please rate the given movie on a scale of 5",
                "isRequired": true,
                "value":"rating"
               
            }

        ]
    }
    
    return( newPanel)
}

export default  MainSurveyQuestion

/*
Example rating styles to try:
 This will place a rating scale with 1-5 with one end symbolizing very good and other very bad.
            {
                "type": "rating",
                "name": "overall",
                "title": "How do you rate the item overall?",
                "minRateDescription": "very bad",
                "maxRateDescription": "very good"
            }

                        {
                "type": "barrating",
                "name": "barrating1",
                "ratingTheme": "fontawesome-stars",
                "title": "Please rate the movie you've just watched",
                "choices": [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5"
                ]
              }

            {
                "type": "nouislider",
                "name": "range",
                "title": "Please range"
            }


             {
      "type": "emotionsratings",
      "name": "emotionsratings-widget",
      "title": "Please rate the movie you've just watched",
      "choices": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ]
    }
    
     {
      "type": "bootstrapslider",
      "name": "bootstrapslider-widget",
      "step": 50,
      "rangeMin": 100,
      "rangeMax": 1000
    }

*/