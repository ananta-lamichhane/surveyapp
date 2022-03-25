import * as Survey from 'survey-react'

//placeholder for recommendation page
var posterpanel =   {
    "type": "panel",
    "innerIndent": 1,
    "name": "panel2",
   // "state": "expanded",
    "elements": [
        // add elements externally here
    ]
}


var reclist_len = 5 // no. of items in the recommendation list
var reclist_movie_ids = ["tt10872600", "tt6320628", "tt2250912", "tt1211837", "tt0848228"]
for(var j=0; j<reclist_len; j++){

       var poster = {
           "type": "image",
           "name": "banner"+(j+2),
           "imageLink": "http://img.omdbapi.com/?apikey=afb2e202&i="+reclist_movie_ids[j],
           "imageWidth": "auto",
           "imageHeight": "auto",
       }
       var description = {
           "type": "html",
           "name": "info",
           "html": "<h2>Information about the movie</h2>"
       }

  posterpanel.elements.push(poster)
  posterpanel.elements.push(description)

}

var Single_rating =     
{
   "title":"",
   "pages": 
        [
            {

            "name": "page1",
            "elements": 
                [
                    posterpanel,
                    {
                        "type": "html",
                        "name": "metric1",
                        "html": "<h2>Please rate the recommendatons.</h2>",
            
                    },
                    {
                        "type": "customrating",
                        "name": "metric1",
                        "title": "Serendipity",
                        "isRequired": true,
            
                    }
                ]
            },
            {

                "name": "page1",
                "elements": 
                    [
                        posterpanel,
                        {
                            "type": "customrating",
                            "name": "metric2",
                            "title": "Novelty",
                            "isRequired": true,
                
                        }
                    ]
                },
                {

                    "name": "page1",
                    "elements": 
                        [
                            posterpanel,
                            {
                                "type": "customrating",
                                "name": "metric3",
                                "title": "Utility",
                                "isRequired": true,
                    
                            }
                        ]
                    },
                    {

                        "name": "page1",
                        "elements": 
                            [
                                posterpanel,
                                {
                                    "type": "customrating",
                                    "name": "metric4",
                                    "title": "Diversity",
                                    "isRequired": true,
                        
                                }
                            ]
                        },
                        {

                            "name": "page1",
                            "elements": 
                                [
                                    posterpanel,
                                    {
                                        "type": "customrating",
                                        "name": "metric5",
                                        "title": "Unexpectedness",
                                        "isRequired": true,
                            
                                    }
                                ]
                            }
        ]
}

var RecommendationPageModel = new Survey.Model(Single_rating)
RecommendationPageModel.onUpdatePanelCssClasses.add(function (survey, options){
    //  console.log("current page no from update classes: "+ model2.currentPageNo)
      
    var classes = options.cssClasses
    classes.panel.container += " rec_panel_container";
      
    
})

export default RecommendationPageModel