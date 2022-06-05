import * as Survey from "survey-react"
import MainSurveyQuestion from "../components/surveyJSTemplateJSONS/mainSurveyQuestion"

function CreateTemplatePage(itemnr, totalitems){
    var progressBar = `
    	<div class= "progress-text">
            <h6>Item ${itemnr} of ${totalitems}</h6>
        </div>
    `
        var newPage = {
            "name": "page",
            "elements": [
                {
                    "type": "html",
                    "name": "info",
                    "html": progressBar
                }
                

            ]
        }
    //console.log("newpage")
   // console.log(newPage)
    var page = new Survey.PageModel("newPage")
    page.fromJSON(newPage)
    return page
}



function CreateNewPanel(rawData){
    var movie_info = "<div class='description_text'><h2>"+ rawData.next_item.description.title+"</h2>"+
    "<h4>Year: " + rawData.next_item.description.year +
    "<h4>Director: " + rawData.next_item.description.director + "</h3>" +
    "<h4>Actors: " + rawData.next_item.description.actors + "</h3>" +
    "<p Plot: >" + rawData.next_item.description.plot + "</p></div>"

    var newPanel = MainSurveyQuestion(rawData.next_item.description.poster,
        movie_info,
        rawData.next_item.item_id
        )
    var panel = new Survey.PanelModel('newpanel')
    panel.fromJSON(newPanel)
    return panel
}



export {CreateTemplatePage, CreateNewPanel}
