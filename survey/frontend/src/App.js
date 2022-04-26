
import './App.css';
import {MainSurvey} from './components/surveyJSComponents/main_survey';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import { SurveyCreationForm } from './components/dashboard/CommonComponents/surveyCreationForm';
import { OfflineEvalCreationForm } from './components/dashboard/OfflineEvalComponents/offlineEvalCreationForm';
import { DatasetCreationForm } from './components/dashboard/DatasetsComponents/datasetCreationForm';

const dashboard = Dashboard


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="survey" element={    
      <>
        <div className="App">
      
            <MainSurvey />
        </div>
      </>
    }
   />
      <Route path = "/" element={
      <div>
        <Dashboard />
      </div>} />

      <Route path = "/create/survey" element={
      <div>
        <SurveyCreationForm />
      </div>} />
      <Route path = "/create/offline_eval" element={
      <div>
        <OfflineEvalCreationForm />
      </div>} />
      <Route path = "/create/dataset" element={
      <div>
        <DatasetCreationForm />
      </div>} />


      <Route path="/welcome" element={
        <div className='Welcome_Page_Placeholder'>
          <h2>Recommender Systems Survey</h2>
          <p>Welcome to recommender systems web application.</p>
          <p>Click <a href="/survey">here</a> to start the survey</p>
          
          
        </div>
    } />
    </Routes>
  </BrowserRouter>

  );
}

export default App;
