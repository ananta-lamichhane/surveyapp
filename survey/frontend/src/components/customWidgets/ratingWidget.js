import * as Survey from "survey-react";

/*
    CREATE A CUSTOM RATING WIDGET
    Users should be able to rate a movie on a scale of 0-5 based
    by clicking a 5 star ratings widget
    Granularity is set to 0.5, i.e. half star for 0.5 full star for 1.
    Utilizes Surveyjs custom widget creation function
    More info at: https://surveyjs.io/Documentation/Survey-Creator?id=Create-Custom-Widget

*/

var createRatingsWidget = (wigetName) =>{
    var customRatingWidget = {
        
        //the widget name. It should be unique and written in lowercase.
        name: "customrating",
        title: "customRating",
        //SurveyJS library calls this function for every question to check 
        //if this widget should apply to the particular question.
        isFit: function (question) {
            //We are going to apply this widget for comment questions (textarea)
            return question.getType() === "customrating";
        },
        init(){
            Survey.Serializer.addClass("customrating", [], null, "empty")
        },
        //We will change the default rendering, but do not override it completely
        isDefaultRender: true,

    
        //"question" parameter is the question we are working with and "el" parameter is HTML textarea in our case
        afterRender: function (question, el) {
            var rand = Math.floor(Math.random(100) * 100)
            

        //  question.defaultValue = -1
            el.className = "customRating"+rand
            //Create a div with an input text and a button inside
            var mainDiv = document.createElement("div")
                mainDiv.className = "ratings_container"+rand
                mainDiv.id = 'ratings_container'+rand
            var dontknowdiv = document.createElement("div")
                dontknowdiv.className = "dontKnowDiv"
    
            var fieldset = document.createElement("fieldset")
                fieldset.className = "rate"
                fieldset.id = "fieldSet"+ rand
            var dontknow =  document.createElement("input")
                dontknow.type = "radio"
                dontknow.id = "dontknow"
                dontknow.name = "dontknow_radio"
                dontknow.className = "form-check-input"
                dontknow.value = "0"
            

            var dontknowlabel = document.createElement("label")
                dontknowlabel.htmlFor = "dontknow"
                dontknowlabel.title = "Dont know"
                dontknowlabel.innerText = "Don't know"
            
            // assing question value (answer) when clicked / unclicked
            dontknow.onchange = function(){
                question.value = dontknow.value
            }

            // extra variable to keep track of the radio button state
            var checkchecked = false

            // initialize radio button check
            dontknow.checked = checkchecked
            dontknow.onclick = function(){
            
            if(checkchecked === true){
                checkchecked = false
                dontknow.checked = checkchecked
                question.value = -1

                
                
            }else{
                checkchecked = true
                dontknow.checked = checkchecked
                question.value = 0

                
            }
            }





        



        // create the stars, as a fieldset of readio buttons
            var rating10 =   document.createElement("input")
            rating10.type = "radio"
            rating10.id = "rating10"
            rating10.name = "rating"
            rating10.value = "10"
            rating10.className = "rating"

            var label10 = document.createElement("label")
            label10.htmlFor = "rating10"
            label10.title= "5 stars"
            rating10.onclick = "alert('what the hell')"

            var rating9 =    document.createElement("input")
            rating9.type = "radio"
            rating9.id = "rating9"
            rating9.name = "rating"
            rating9.value = "9"
            rating9.className = "rating"

            var label9 = document.createElement("label")
            label9.htmlFor = "rating9"
            label9.className ="half"
            label9.title = "4.5 stars"
            

            var rating8 =    document.createElement("input")
            rating8.type = "radio"
            rating8.id = "rating8"
            rating8.name = "rating"
            rating8.value = "8"
            rating8.className = "rating"

            var label8 = document.createElement("label")
            label8.htmlFor = "rating8"
            label8.title = "4 stars"

    

            var rating7 =    document.createElement("input")
            rating7.type = "radio"
            rating7.id = "rating7"
            rating7.name = "rating"
            rating7.value = "7"
            rating7.className = "rating"

            var label7 = document.createElement("label")
            label7.htmlFor = "rating7"
            label7.className ="half"
            label7.title = "3.5 stars"

            var rating6 =    document.createElement("input")
            rating6.type = "radio"
            rating6.id = "rating6"
            rating6.name = "rating"
            rating6.value = "6"
            rating6.className = "rating"

            var label6 = document.createElement("label")
            label6.htmlFor = "rating6"
            label6.title = "3 stars"

            var rating5 =    document.createElement("input")
            rating5.type = "radio"
            rating5.id = "rating5"
            rating5.name = "rating"
            rating5.value = "5"
            rating5.className = "rating"

            var label5 = document.createElement("label")
            label5.htmlFor = "rating5"
            label5.className ="half"
            label5.title = "2.5 stars"

            var rating4 =    document.createElement("input")
            rating4.type = "radio"
            rating4.id = "rating4"
            rating4.name = "rating"
            rating4.value = "4"
            rating4.className = "rating"

            var label4 = document.createElement("label")
            label4.htmlFor = "rating4"
            label4.title = "2 stars"

            var rating3 =    document.createElement("input")
            rating3.type = "radio"
            rating3.id = "rating3"
            rating3.name = "rating"
            rating3.value = "3"
            rating3.className = "rating"

            var label3 = document.createElement("label")
            label3.htmlFor = "rating3"
            label3.className ="half"
            label3.title = "1.5 stars"

            var rating2 =    document.createElement("input")
            rating2.type = "radio"
            rating2.id = "rating2"
            rating2.name = "rating"
            rating2.value = "2"
            rating2.className = "rating"

            var label2 = document.createElement("label")
            label2.htmlFor = "rating2"
            label2.title = "1 star"

            var rating1 =    document.createElement("input")
            rating1.type = "radio"
            rating1.id = "rating1"
            rating1.name = "rating"
            rating1.value = "1"
            rating1.className = "rating"

            var label1 = document.createElement("label")
            label1.htmlFor = "rating1"
            label1.className ="half"
            label1.title = "0.5 star"

            // append the created radio buttons to the fieldset
            fieldset.appendChild(rating10)
            fieldset.appendChild(label10)
            fieldset.appendChild(rating9)
            fieldset.appendChild(label9)
            fieldset.appendChild(rating8)
            fieldset.appendChild(label8)
            fieldset.appendChild(rating7)
            fieldset.appendChild(label7)
            fieldset.appendChild(rating6)
            fieldset.appendChild(label6)
            fieldset.appendChild(rating5)
            fieldset.appendChild(label5)
            fieldset.appendChild(rating4)
            fieldset.appendChild(label4)
            fieldset.appendChild(rating3)
            fieldset.appendChild(label3)
            fieldset.appendChild(rating2)
            fieldset.appendChild(label2)
            fieldset.appendChild(rating1)
            fieldset.appendChild(label1)

        //  fieldset.appendChild(dontknow)





        // append the crated fieldset to the div
            mainDiv.appendChild(fieldset)
            dontknowdiv.appendChild(dontknow)
            dontknowdiv.appendChild(dontknowlabel)
            mainDiv.appendChild(dontknowdiv)
            
            //el.parentElement.insertBefore(mainDiv, el);
            el.appendChild(mainDiv)

            var f = document.getElementById('fieldSet'+rand)
            var allbuttons = f.getElementsByClassName('rating')
            f.onclick = function(){
                for(var i=0;i<allbuttons.length; i++){
                    if(allbuttons[i].checked === true){
                        var trueRating = 5.0 - i/2
                        dontknow.checked = false
                        question.value = trueRating
                    }
                }
            }
    
            // what to do when the answer (value has changed)


            // preload value
            var flippedVal = 5- question.value 
            //actual star number (starting 0) and their place in div are flipped
            for(var i=9;i>=flippedVal * 2; i--){
                (allbuttons[i].checked = true)
            } 
            var updateHandler = function(){
                return question.value
            }


            question.valueChangedCallback = updateHandler
        },
    };

//Register our widget in singleton custom widget collection


    
    //Register our widget in singleton custom widget collection
    Survey.CustomWidgetCollection.Instance.add(customRatingWidget);
    }
    


    
    

export default createRatingsWidget

