import React, { useContext, useEffect, useState } from 'react'
import noteContext from '../Context/Notecontext'
import "../styles/SlotGrid.css";
import { useNavigate } from 'react-router-dom';
import Slots from './Slots';
const SlorGrid = () => {
  const context = useContext(noteContext);
  const { locationStatus, available } = context;
  let [slots, setSlots] = useState("");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    async function status() {
      if (available) {
        const id = available.location[0]._id;
        console.log(available, id)
        if (id !== null) {
          const result = await locationStatus(id);
          setSlots((prev) => prev = result);
          localStorage.setItem("slots", JSON.stringify(slots));
          console.log(slots, result)
        } else {
          navigate("/DashBoard/Locations")
        }
      }

    }
    status();
  }, [slots !== ""])
  useEffect(() => {
    // if(localStorage.getItem("slots")){
    //   console.log(JSON.parse(localStorage.getItem("slots")));
    //   setSlots((prev)=>JSON.parse(localStorage.getItem("slots")));
    // }
    async function reload() {
      if (available) {
        const id = available.location[0]._id;
        if (id !== null) {
          const result = await locationStatus(id);
          setSlots((prev) => prev = result);
          localStorage.setItem("slots", JSON.stringify(slots));
          console.log(slots, result)
        }
      }
      else{
        setSlots((prev)=>JSON.parse(localStorage.getItem("slots")));
      }
    }
    reload();
  }, [document.location.reload])


  return (
    <>
      {msg ? <h1>{msg}</h1> :
        <div className='grid_main'>
          <h2>Parking Slots</h2>
          <div className='SlorGrid' >
            {slots ? <div className='content'>{slots.map((slot) => {
              return <Slots key={slot._id} info={slot} />
            })}</div> : "No Slot available"}

          </div>
        </div>}
    </>
  )
}

export default SlorGrid

