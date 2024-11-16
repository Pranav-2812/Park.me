
import './App.css'
import {

  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar"
import Navbar from "./components/Navbar";
import AuthSign from './components/AuthSign';
import UserSign from './components/UserSign';
import UserLogin from './components/UserLogin';
import AuthLog from './components/AuthLog';
import OwnerSign from './components/OwnerSign';
import OLog from './components/OLog';
import { useEffect, useState } from 'react';
import MP from './components/MP';
import Home from './components/Home';
import Notesate from './Context/Notesate';
import LocGrid from './components/LocGrid';
import SlorGrid from './components/SlorGrid';
import Avail from './components/Avail';



function App() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate("/Home");
    }
  },[])
  return (
    <>

      <LoadingBar color='yellow' progress={progress} />
      <Notesate setProgress={setProgress}>
        <Navbar setProgress={setProgress} />
        <hr className='hr'></hr>
        <Routes>
          <Route exact path='/Home' element={<Home setProgress={setProgress} />}></Route>
          <Route exact path='/AuthSign' element={<AuthSign setProgress={setProgress} />}></Route>
          <Route exact path='/AuthLog' element={<AuthLog setProgress={setProgress} />}></Route>
          <Route exact path='/UserSign' element={<UserSign setProgress={setProgress} />}></Route>
          <Route exact path='/UserLog' element={<UserLogin setProgress={setProgress} />}></Route>
          <Route exact path='/ownerSign' element={<OwnerSign setProgress={setProgress} />}></Route>
          <Route exact path='/ownerLog' element={<OLog setProgress={setProgress} />}></Route>
          <Route exact path='/DashBoard' element={<MP setProgress={setProgress} />}></Route>
          <Route exact path="/DashBoard/Locations"element={<SlorGrid setProgress={setProgress}/>}></Route>
          <Route exact path='/AvailCheck' element={<Avail setProgress={setProgress} />}></Route>

        </Routes>
      </Notesate>
    </>
  )
}

export default App
