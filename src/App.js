import './App.css';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Auth/Login';
import SignIn from './components/Auth/SignIn';
import Dashboard from './components/Auth/Dashboard';
import DashboardDesign from './components/Auth/DashboardDesign';
function App() {
  return (
    <div className="App">
         <Routes>
              <Route element={<Login/>} path='/'/>
              <Route element={<Login/>} path='/login'/>
              <Route element={<SignIn/>} path='/signin'/>
              <Route element={<Dashboard/>} path='/dashboard'/>
              <Route element={<DashboardDesign/>} path='/dashboarddesign'/>
         </Routes>
    </div>
  );
}

export default App;