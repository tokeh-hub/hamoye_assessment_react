import logo from './logo.svg';
import './App.css';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Auth/Login';
import SignIn from './components/Auth/SignIn';
import Dashboard from './components/Auth/Dashboard';
function App() {
  return (
    <div className="App">
         <Routes>
              <Route element={<Login/>} path='/'/>
              <Route element={<Login/>} path='/login'/>
              <Route element={<SignIn/>} path='/signin'/>
              <Route element={<Dashboard/>} path='/dashboard'/>
         </Routes>
    </div>
  );
}

export default App;