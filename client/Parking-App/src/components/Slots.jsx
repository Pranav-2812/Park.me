// import React, { useContext, useEffect, useState, useRef } from 'react'
// import "../styles/Slots.css"
// import noteContext from '../Context/Notecontext';
// const Slots = (props) => {
//   const context = useContext(noteContext);
//   const { data, socket, bookSlot } = context;
//   const ref = useRef();
//   const [bookInfo, setBookInfo] = useState({ duration: 0 });
//   const [modal, setModal] = useState(false);
//   // const [booked, setBooked] = useState(false);
//   useEffect(() => {
//     if (!props.info.isAvailable) {
//       document.getElementById(`${props.info._id}`).style.border = "2px solid red";
//     }
//     else {
//       document.getElementById(`${props.info._id}`).style.border = "2px solid rgb(32, 204, 32)";
//     }
//   }, [])
//   useEffect(() => {
//     if (!socket) {
//       console.log("kuch nai hai bhai")
//     }; // Ensure socket is available
  
    
//     socket.on("book", (transaction) => {
//       console.log("socket code");
//       document.getElementById(`${transaction.slot_no}`).style.border = "2px solid red";
//       document.getElementById(`book-btn-${transaction.slot_no}`).style.display = "none";
//     });
//     socket.on("hi",(msg)=>alert(msg));
//     // Clean up the event listener on unmount
//     return () => {
//       socket.off("book");
//     };
//   }, [socket]);
  
//   const openModal = () => {

//     setModal((prev) => true);
//   }
//   const closeModal = () => {

//     setModal((prev) => false);
//   }
//   window.onclick = (e) => {
//     if (e.target === document.querySelector(".booking_modal")) {
//       closeModal();
//     }
//   }
//   const change = (e) => {
//     setBookInfo({ ...bookInfo, [e.target.name]: e.target.value });
//   }
//   const book = async () => {
//     const id = ref.current.id;
//     console.log(id);
//     const result = await bookSlot(id);
//     if (result.success === true) {
//       console.log("booked");
//       closeModal();
//     }
//     else {
//       console.log(result.error);
//     }
//   }
//   return (
//     <>

//       <div className={`slot`} ref={ref} id={`${props.info._id}`} >

//         <h2>{props.info.slot_no.slice(24)}</h2>
//         {props.info.isAvailable? <button onClick={openModal} id={`book-btn-${props.info._id}`}>Book Now!</button>:"Not Available"}

//       </div>
//       {modal ?
//         <div className="booking_modal">
//           <div className="modal_content">
//             <div className="modal_header">
//               <h2>Enter Details</h2>
//               <span className='close_btn' onClick={closeModal}>&times;</span>
//             </div>
//             <hr></hr>
//             <div className="modal_body">
//               <div className="label">
//                 <label htmlFor='duration'>Enter Duration&ensp;<p>{bookInfo.duration < 20 && bookInfo.duration !== "" ? "Can't Park for less than 20m" : "(IN MINUTES)"}</p></label>
//               </div>
//               <input required autoComplete='on' name='duration' min={20} value={bookInfo.duration} onChange={change} type='number' id='duration' />
//               {bookInfo.duration >= 20 ?
//                 <span className='bill'>
//                   Total payable for {bookInfo.duration} min : {data ? data.vehicle_type === "bike" ? "Rs." + bookInfo.duration * 0.5 : "Rs." + bookInfo.duration * 1 : console.log(context)}
//                 </span> : ""}
//               <button type='submit' disabled={bookInfo.duration < 20} onClick={book}>Pay Now</button>

//             </div>
//           </div>
//         </div> :
//         ""}
//     </>
//   )
// }

// export default Slots

import React, { useContext, useEffect, useState, useRef } from 'react';
import "../styles/Slots.css";
import noteContext from '../Context/Notecontext';
import socket from '../Service/socket';
const Slots = (props) => {
  const context = useContext(noteContext);
  const { data, bookSlot } = context;
  const ref = useRef();
  const [bookInfo, setBookInfo] = useState({ duration: 0 });
  const [modal, setModal] = useState(false);

  // Update slot availability styles on mount
  useEffect(() => {
    if (props.info._id) {
      const slotElement = document.getElementById(`${props.info._id}`);
      if (slotElement) {
        slotElement.style.border = props.info.isAvailable
          ? "2px solid rgb(32, 204, 32)"
          : "2px solid red";
      }
    }
  }, [props.info]);

  // Setup and teardown socket event listeners when socket changes
  useEffect(() => {
    socket.on("book", (transaction) => {
      console.log("socket code: book event");
      if (transaction.slot_no === props.info._id) {
        document.getElementById(`${transaction.slot_no}`).style.border = "2px solid red";
        document.getElementById(`book-btn-${transaction.slot_no}`).style.display = "none";
        
      }
    });
    return () => {
      if (socket) {
        socket.off("book");
        socket.off("hi");
      }
    };
  }, [socket, props.info]);

  // Modal open/close handlers
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // Handle outside click to close modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modal && e.target.classList.contains("booking_modal")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [modal]);

  // Update book info state
  const change = (e) => {
    setBookInfo({ ...bookInfo, [e.target.name]: e.target.value });
  };

  // Book slot handler
  const book = async () => {
    if (ref.current && ref.current.id) {
      const result = await bookSlot(ref.current.id);
      if (result.success === true) {
        console.log("booked");
        closeModal();
      } else {
        console.log(result.error);
      }
    }
  };
  const handleError = ()=>{
    alert("Please go back and refresh!");
    document.getElementById("pay-btn").disabled = true;
  }
  return (
    <>
      <div className={`slot`} ref={ref} id={`${props.info._id}`}>

        <h2>{props.info.slot_no.slice(24)}</h2>
        {props.info.isAvailable ? (
          <button onClick={openModal} id={`book-btn-${props.info._id}`}>
            Book Now!
          </button>
        ) : (
          ""
        )}
        
      </div>

      {modal ? (
        <div className="booking_modal">
          <div className="modal_content">
            <div className="modal_header">
              <h2>Enter Details</h2>
              <span className="close_btn" onClick={closeModal}>&times;</span>
            </div>
            <hr />
            <div className="modal_body">
              <div className="label">
                <label htmlFor="duration">
                  Enter Duration
                  <p>
                    {bookInfo.duration < 20 && bookInfo.duration !== ""
                      ? "Can't Park for less than 20m"
                      : "(IN MINUTES)"}
                  </p>
                </label>
              </div>
              <input
                required
                autoComplete="on"
                name="duration"
                min={20}
                value={bookInfo.duration}
                onChange={change}
                type="number"
                id="duration"
              />
              {bookInfo.duration >= 20 ? (
                <span className="bill">
                  Total payable for {String(bookInfo.duration)[0]==="0"?String(bookInfo.duration).slice(1):bookInfo.duration} min :{" "}
                  {data
                    ? (data.vehicle_type === "bike"
                        ? "Rs." +String(bookInfo.duration)[0]==="0"?Number(String(bookInfo.duration).slice(1))* 0.5:bookInfo.duration *0.5
                        : "Rs." +String(bookInfo.duration)[0]==="0"?Number(String(bookInfo.duration).slice(1))* 1:bookInfo.duration *1)
                    :alert("Some Error , please go back and refresh!")}
                </span>
              ) : (
                ""
              )}
              <button
                type="submit"
                disabled={bookInfo.duration < 20|| !data}
                onClick={book}
                id='pay-btn'
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Slots;
