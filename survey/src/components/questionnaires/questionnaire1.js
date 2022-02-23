//set up content for the survey questions (preference elicitation)
const Survey1_json =
{
    "title":"Recommender Systems Survey",
    "showProgressBar": "top",
    "pages": []
        
}

//add new pages (movie posters + info + rating slider) to the survey
var num_items = 3 // total no. of items in survey questionnaire.
for(var i=1; i<=num_items; i++){
    var pageN = "page" + i
    var movieids = ["tt0145487","tt0316654","tt0413300"]
    var newPage = {
        "name": pageN,
        "elements": [
            {
                "type": "image",
                "name": "banner",
                "imageLink": "http://img.omdbapi.com/?apikey=afb2e202&i="+movieids[i-1],
                "imageWidth": "500px",
                "imageHeight": "300px",
            },
            {
                "type": "html",
                "name": "info",
                "html": "<h2>Information about the movie</h2>"
            },
            {
                "type": "bootstrapslider",
                "name": "Please rate the above movie from 1 to 5",
                "step": 0.5,
                "rangeMin": 0,
                "rangeMax": 5,
            }
            
        ]
    }
   
    Survey1_json.pages = Survey1_json.pages.concat([newPage])
}
//console.log(Survey1_json)


var recommendations_survey =     {
    "title":"Recommender Systems Survey",
    "showProgressBar": "top",
    "pages": []
}
var recommendations_page = 
            {
                "name": "page1",
                "elements": [
                    {
                        "type": "html",
                        "name": "info",
                        "html": "<h2>Please rate the following Recommendation</h2>"
                    },
                    {
                    "type": "panel",
                    "innerIndent": 1,
                    "name": "panel2",
                    "title": "",
                   // "state": "expanded",
                    "elements": [
                        // add elements externally here
                    ]
                },   
                    {
                        "type": "bootstrapslider",
                        "name": "metric 1",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                        "isrequired":true
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 2",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 3",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 4",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 5",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    }

                ]
            }

    //second page for recommendation lists
    var recommendations_page2 = 
            {
                "name": "page2",
                "elements": [
                    {
                        "type": "html",
                        "name": "info",
                        "html": "<h2>Please rate the following Recommendation</h2>"
                    },
                    {
                    "type": "panel",
                    "innerIndent": 1,
                    "name": "panel2",
                    "title": "",
                   // "state": "expanded",
                    "elements": [
                        // add elements externally here
                    ]
                },   
                    {
                        "type": "bootstrapslider",
                        "name": "metric 1",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                        "isrequired":true
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 2",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 3",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 4",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    },
                    {
                        "type": "bootstrapslider",
                        "name": "metric 5",
                        "step": 0.5,
                        "rangeMin": 0,
                        "rangeMax": 5,
                    }

                ]
            }

var reclist_len = 5 // no. of items in the recommendation list
var reclist_movie_ids = ["tt10872600", "tt6320628", "tt2250912", "tt1211837", "tt0848228"]
for(var j=0; j<reclist_len; j++){
    var newMovie = //individual reclist item (movie poster plus basic info)
    {
    "type": "panel",
    "innerIndent": 1,
    "name": "panel2",
    "title": "",
    // "state": "expanded",
    "elements": [
        // add elements externally here
        {
            "type": "image",
            "name": "banner"+(i+2),
            "imageLink": "http://img.omdbapi.com/?apikey=afb2e202&i="+reclist_movie_ids[j],
            "imageWidth": "auto",
            "imageHeight": "auto",
        },
        {
            "type": "html",
            "name": "info",
            "html": "<h2>Information about the movie</h2>"
        }
    ]
    }

    

    
   recommendations_page.elements[1].elements.push(newMovie)
   recommendations_page2.elements[1].elements.push(newMovie)

}
recommendations_survey.pages.push(recommendations_page)
recommendations_survey.pages.push(recommendations_page2)
//console.log(recommendations_page)



export {Survey1_json, recommendations_survey}