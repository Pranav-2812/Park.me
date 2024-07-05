import React, { useContext, useEffect } from 'react'
import "../styles/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'
import noteContext from '../Context/Notecontext'

const Navbar = (props) => {
  const navigate = useNavigate()

  const Logout = () => {
    props.setProgress(50);
    localStorage.clear();

    props.setProgress(100);
    navigate("/Home")
  }
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/Home");
    }
  }, [])

  return (
    <div className='main'>
      <div className="logo">PARK.ME</div>
      <div className="elements">
        <ul>
          <li className='links'><Link className='link-txt' to={"/"}>HOME</Link></li>
          <li className='links'><Link className='link-txt' to={"/About"}>ABOUT</Link></li>
          <li className='links'><Link className='link-txt' to={"/AvailCheck"}>AVAILABILITY</Link></li>
          <li className='links'><Link className='link-txt' to={"/Contact"}>CONTACT</Link></li>
        </ul>
        {!localStorage.getItem("token") ? <div className="btns">
          <span className='nav-btn'><Link className='link-btn' to={"/AuthSign"}>SIGN UP</Link></span>
          <span className='nav-btn'><Link className='link-btn' to={"/AuthLog"}>LOGIN</Link></span>
        </div> : <button className='logout' onClick={Logout}>Log Out!</button>}

      </div>


    </div>
  )
}

export default Navbar
