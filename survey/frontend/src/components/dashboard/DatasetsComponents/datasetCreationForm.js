import React from 'react'
import {useState, useEffect } from 'react'
import 'survey-react/survey.css'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Survey from 'survey-react'
import PostData from '../../../utils/postdata'


export const DatasetCreationForm = () =>{
const [backendData, setBackendData] = useState()
useEffect(() => {
    fetch('http://localhost:5000/survey')
    .then(response =>response.json()).then(data =>{
        console.log(JSON.parse(data.datasets[0]).id)
        setBackendData(data)
    })
}, [])
var algorithms = ["NormalPredictor", "BaselineOnly", "KNNBasic", "KNNWithMeans", "KNNWithZScore",
    "KNNBaseline", "SVD", "SVDpp", "NMF", "SlopeOne", "CoClustering"]
var templateJSON = {
    "title": "Create and deploy a new survey",
    "name": "recSysSurvey",
    "pages": [
         {   
            //"title": "Offline Evaluation",
            "navigationTitle": "Offline Evaluation",
           // "navigationDescription": "Your feedback",
            "elements":[
                {
                    "type": "panel",
                    "name": "placeholder",
                  //  "visibleIf": "{offlineEvalChoice}='Yes'",
                    "elements":[
                        {
                            "type": "text",
                            "name": "datasetName",
                            "title": "Name",
                            "isRequired": true,
                           // "visibleIf": "{createRecList} = 'Yes'"
                        },
                        {
                            "type": "text",
                            "name": "datasetNumUsers",
                            "title": "Number of users",
                            "isRequired": false,
                           // "visibleIf": "{createRecList} = 'Yes'"
                        },
                        {
                            "type": "text",
                            "name": "datasetNumItems",
                            "title": "Number of Items",
                            "isRequired": false,
                           // "visibleIf": "{createRecList} = 'Yes'"
                        },
                        {
                            "type": "file",
                            "title": "Upload the ratings CSV file.",
                            "name": "datasetRatingsCSVFile",
                            "storeDataAsText": false,
                            "showPreview": true,
                            "maxSize": 1024 * 1024 * 100 // max file size 100MB
                        }

                        



                    ]
                }
            ]
        }
    ]
}

    var CreateNewOfflineEvalModel = new Survey.Model(templateJSON)



// This global variable is used for storing choosen files while survey is not completed
var temporaryFilesStorage = {};

 CreateNewOfflineEvalModel
    .onComplete
    .add(function (result) {
        // In this handler we upload the files to the server from the temporary storage

        // alert("Uploading files");
        console.log("Uploading files");
        // You need here to wait all files to be uploaded
        // And only then show the results
        function onFilesUploaded() {
            console.log("file upload")
           // document
              ///  .querySelector('#surveyResult')
              //  .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
        }

        // temporaryFilesStorage keys are the question names
        var questionsToUpload = Object.keys(temporaryFilesStorage);

        var uploadedQuestionsCount = 0;
        questionsToUpload.forEach(function (questionName) {
            var question = CreateNewOfflineEvalModel.getQuestionByName(questionName);
            var filesToUpload = temporaryFilesStorage[questionName];

            var formData = new FormData();
            filesToUpload.forEach(function (file) {
                formData.append(file.name, file);
            });
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:5000/offline_eval"); // https://surveyjs.io/api/MySurveys/uploadFiles
            xhr.onload = function () {
                var data = JSON.parse(xhr.responseText);
                question.value = filesToUpload.map(function (file) {
                    return {
                        name: file.name,
                        type: file.type,
                        content: data[file.name]
                    };
                });
                uploadedQuestionsCount++;
                // If all files has been uploaded then show the results
                if (uploadedQuestionsCount === questionsToUpload.length) {
                    onFilesUploaded();
                }
            };
            xhr.onerror = function () {
                question.value = [
                    {
                        name: "file1",
                        type: "image/jpeg",
                        content: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
                    }
                ];
                uploadedQuestionsCount++;
                // If all files has been uploaded then show the results
                if (uploadedQuestionsCount === questionsToUpload.length) {
                    onFilesUploaded();
                }
            };
            xhr.send(formData);

        });

        // If nothing to upload then show the results
        if (0 === questionsToUpload.length) {
            onFilesUploaded();
        }

    });


CreateNewOfflineEvalModel
    .onUploadFiles
    .add(function (survey, options) {
        // Add files to the temporary storage
        if (temporaryFilesStorage[options.name] !== undefined) {
            temporaryFilesStorage[options.name].concat(options.files);
        } else {
            temporaryFilesStorage[options.name] = options.files;
        }

        // Load previews in base64. Until survey not completed files are loaded temporary as base64 in order to get previews
        var question = survey.getQuestionByName(options.name);
        var content = [];
        options
            .files
            .forEach(function (file) {
                let fileReader = new FileReader();
                fileReader.onload = function (e) {
                    content = content.concat([
                        {
                            name: file.name,
                            type: file.type,
                            content: fileReader.result,
                            file: file
                        }
                    ]);
                    if (content.length === options.files.length) {
                        //question.value = (question.value || []).concat(content);
                        options.callback("success", content.map(function (fileContent) {
                            return {file: fileContent.file, content: fileContent.content};
                        }));
                    }
                };
                fileReader.readAsDataURL(file);
            });
    });










    /* CreateNewOfflineEvalModel.onUploadFiles
    .add(function (survey, options) {
        var formData = new FormData();
        options
            .files
            .forEach(function (file) {
                formData.append(file.name, file);
            });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5000/offline_eval"); // https://surveyjs.io/api/MySurveys/uploadFiles
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
             options.callback("success", options.files.map(function (file) {
                return {
                    file: file,
                    content: data[file.name]
                };
            }));
        };
        xhr.send(formData);
    }); */


    return (
        <div>
        <Survey.Survey model={CreateNewOfflineEvalModel} />
    </div>
    )
}