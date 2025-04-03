import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedPage from './components/ProtectedPage';
import Projects from './pages/Projects';
import ProjectDetails from './pages/Home/ProjectDetails';
import Logs from './pages/Logs';
import Sessions from './pages/Sessions';
import AdminPage from './pages/AdminPage';


function App() {
 
  return (
    <div>
      <BrowserRouter>
       <Routes>
         <Route path='/' 
                element={
                <ProtectedPage>
                  <Home/>
                </ProtectedPage>}/>
        <Route
                path="/project/:id"
                element={
                  <ProtectedPage>
                    <ProjectDetails />
                  </ProtectedPage>}/>      
         <Route path='/projects' 
                element={
                <ProtectedPage>
                  <Projects/>
                </ProtectedPage>}/>       
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
       </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

 /* 
 
 getting rid of the admin features when deploying and hosting the application
 
 <Route path='/sessions' 
                element={
                <ProtectedPage>
                  <Sessions/>
                </ProtectedPage>}/>         
         <Route path='/adminpage' 
                element={
                <ProtectedPage>
                  <AdminPage/>
                </ProtectedPage>}/>     
                <Route path='/logs' 
                element={
                <ProtectedPage>
                  <Logs/>
                </ProtectedPage>}/>   
                
                
                */   
