import React, { useContext, useEffect, useState } from 'react'
import noteContext from '../Context/Notecontext'
import "../styles/SlotGrid.css";
import { useNavigate,useLocation } from 'react-router-dom';
import Slots from './Slots';
const BikeSlotGrid = () => {
  const context = useContext(noteContext);
  const { getBikeSlots, available } = context;
  let [slots, setSlots] = useState("");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();
  const [loc,setLoc] =useState({});
  const location = useLocation();
  useEffect(() => {
    async function status() {
      if (available) {
        const id = available.location[0]._id;
        console.log(available, id)
        if (id !== null) {
          const result = await getBikeSlots(id);
          setSlots((prev) => prev = result.bikes);
          setLoc((prev)=>prev=result.location);
          localStorage.setItem("bikeSlots", JSON.stringify(slots));
          console.log(slots, result)
        } else {
          navigate("/DashBoard/Locations/bike_slots");
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
          const result = await getBikeSlots(id);
          setSlots((prev) => prev = result.bikes);
          setLoc((prev)=>prev=result.location);
          localStorage.setItem("bikeSlots", JSON.stringify(slots));
          console.log(slots, result)
        }
      }
      else{
        setSlots((prev)=>JSON.parse(localStorage.getItem("bikeSlots")));
      }
    }
    reload();
  }, [document.location.reload])

  useEffect(()=>{
    if(location.pathname === "/Dashboard"){
      localStorage.removeItem("bikeSlots");
    }
  },[location.pathname])

  return (
    <>
      {msg ? <h1>{msg}</h1> :
        <div className='grid_main'>
          <h2>Bike Parking Slots</h2>
          <div className='SlorGrid' >
            {slots ? <div className='content'>{slots.map((slot) => {
              return <Slots key={slot._id} info={slot} loc={loc} />
            })}</div> : "No Slot available"}

          </div>
        </div>}
    </>
  )
}

export default BikeSlotGrid

