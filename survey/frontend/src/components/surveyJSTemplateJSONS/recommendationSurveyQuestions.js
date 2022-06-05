


/*
Helps to set the questions ralated to the recommendation lists.
SurveyJS provides with different question types and input methods and ranges

visit: https://surveyjs.io/Examples/Library/?id=questiontype-text&platform=Reactjs&theme=defaultV2
for more detail.

*/

var recommendationQuestions = () =>{
    return( 
  [
    {
        "type": "rating",
        "name": "satisfaction",
        "title": "Which recommendation list would better help you find movies to watch?",
        "isRequired": true,
        "mininumRateDescription": "List 1",
        "maximumRateDescription": "List 2"
    }, 
    {
        "type": "rating",
        "name": "diversity",

        "title": "Which list has a more varied selection of movies?",
        "mininumRateDescription": "List 1",
        "maximumRateDescription": "List 2"
    },
    {
        "type": "rating", // can also be used for novelty as in ekstrand
        "name": "serendipity",

        "title": "Which list has more pleasantly surprising movies?",
        "mininumRateDescription": "List 1",
        "maximumRateDescription": "List 2"
    },
    {
        "type": "rating",
        "name": "acuuracy",

        "title": "Which list has more movies that you find appealing?",
        "mininumRateDescription": "List 1",
        "maximumRateDescription": "List 2"
    },
    {
        "type": "rating",
        "name": "understandsMe",

        "title": "Which list beter understands your taste in movies?",
        "mininumRateDescription": "List 1",
        "maximumRateDescription": "List 2"
    }
  ]


)
}

export default  recommendationQuestions