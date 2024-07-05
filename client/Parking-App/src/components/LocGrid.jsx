import React from 'react'
import { useNavigate } from "react-router-dom"
import "../styles/LocGrid.css"
import testimg from "../asset/test.jpg"
const LocGrid = (props) => {
  const navigate = useNavigate();
  const Enter = () => {
    props.setProgress(50);
    navigate(`/DashBoard/Locations`);
  }
  return (
    <div className='locGrid' onClick={Enter}>
      <img src={testimg}></img>
      <h3><i className="fa-solid fa-location-dot"></i>&ensp;{props.loc.address}</h3>
    </div>
  )
}

export default LocGrid
