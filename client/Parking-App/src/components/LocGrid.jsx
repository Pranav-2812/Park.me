import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import "../styles/LocGrid.css"
import "../styles/Modal.css"
import testimg from "../asset/test.jpg"
import AOS from 'aos'
import "aos/dist/aos.css"
const LocGrid = (props) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  useEffect(()=>{
    AOS.init();
  },[])
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modal && e.target.classList.contains("booking_modal")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [modal]);
  const Enter = () => {
    if(props.loc.location_type === "both"){
      openModal();
    }
  }
  const getParkingSlots = (type) => {
    navigate(`/DashBoard/Locations`);

  }
  return (
    <>

      <div className='locGrid' onClick={Enter} data-aos="fade-right" data-aos-duration="900">
        <img src={testimg}></img>
        <h3><i className="fa-solid fa-location-dot"></i>&ensp;{props.loc.address}</h3>
        <h4>{props.loc.location_type === "both" ? "Type : Car , Bike" : props.loc.location_type}</h4>
      </div>
      {modal ?

        <div className="booking_modal" >
          <div className="modal_content">
            <div className="modal_header" data-aos="fade-right" data-aos-duration="1200"> 
              <h3>Vehicle Type</h3>
              <span className="close_btn" onClick={closeModal}>&times;</span>
            </div>
            <hr />
            <div className="modal_body" data-aos="fade-left" data-aos-duration="1200">
              <div className="modal_body">
                <span onClick={() => getParkingSlots("car")}>Car</span>
                <span onClick={() => getParkingSlots("bike")}>Bike</span>
              </div>

            </div>
          </div>
        </div>
        :
        ""}
    </>

  )
}

export default LocGrid
