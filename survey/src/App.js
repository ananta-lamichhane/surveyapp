
import './App.css';
import {MySurvey, RecommendationSurvey} from './components/first_survey/survey1';
import MyNavbar from './components/navigation';
import { Container, Nav, Navbar } from 'react-bootstrap';
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom'



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="survey" element={    
      <>
        <div className="App">
      
            <MySurvey />
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
