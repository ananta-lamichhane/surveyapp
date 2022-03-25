
import './App.css';
import {MainSurvey} from './components/main_survey';
import {BrowserRouter, Route, Routes} from 'react-router-dom'



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
      <Route path = "/" element={<h2>Admin area</h2>} />

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
