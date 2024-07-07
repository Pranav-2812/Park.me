import React, { useContext, useEffect, useState } from 'react'
import "../styles/Slots.css"
import noteContext from '../Context/Notecontext';
const Slots = (props) => {
  const context = useContext(noteContext);
  const { data } = context;
  const [bookInfo, setBookInfo] = useState({ startTime: "", duration: 0 });
  useEffect(() => {
    if (!props.info.isAvailable) {
      document.querySelector('.slot').style.border = "2px solid red";
    }
  }, [])
  const openModal = () => {
    document.querySelector(".booking_modal").style.display = "block";
  }
  const closeModal = () => {
    document.querySelector(".booking_modal").style.display = "none";
  }
  window.onclick = (e) => {
    if (e.target === document.querySelector(".booking_modal")) {
      closeModal();
    }
  }
  const change = (e) => {
    setBookInfo({ ...bookInfo, [e.target.name]: e.target.value });
  }

  return (
    <>
      <div className='slot' >

        <h2>{props.info.slot_no.slice(24)}</h2>
        {props.info.isAvailable ?
          <button onClick={openModal}>Book Now!</button> : props.info.duration ? <h3>Not Available</h3> : "Error"}

      </div>
      <div className="booking_modal">
        <div className="modal_content">
          <div className="modal_header">
            <h2>Enter Details</h2>
            <span className='close_btn' onClick={closeModal}>&times;</span>
          </div>
          <hr></hr>
          <div className="modal_body">
            <div className="label">
              <label htmlFor='duration'>Enter Duration&ensp;<p>{bookInfo.duration < 20 && bookInfo.duration !== "" ? "Can't Park for less than 20m" : "(IN MINUTES)"}</p></label>
            </div>
            <input required autoComplete='on' name='duration' min={20} value={bookInfo.duration} onChange={change} type='number' id='duration' />
            {bookInfo.duration >= 20 ?
              <span className='bill'>
                Total payable for {bookInfo.duration} min : {data ? data.vehicle_type === "bike" ? "Rs." + bookInfo.duration * 0.5 : "Rs." + bookInfo.duration * 1 : console.log(context)}
              </span> : ""}
            <button type='submit'>Pay Now</button>

          </div>
        </div>
      </div>
    </>
  )
}

export default Slots

