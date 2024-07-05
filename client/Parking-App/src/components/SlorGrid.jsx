import React, { useContext, useEffect, useState } from 'react'
import noteContext from '../Context/Notecontext'
import "../styles/SlotGrid.css";
import { useNavigate } from 'react-router-dom';
import Slots from './Slots';
const SlorGrid = () => {
  const context = useContext(noteContext);
  const { locationStatus,available } = context;
  let [slots, setSlots] = useState("");
  const[msg,setMsg] =useState("")
  const navigate = useNavigate()
  useEffect(() => {
    async function status() {
      if(available){
        const id = available.location[0]._id;
        console.log(id)
       if(id!==null){
        const result = await locationStatus(id);
        setSlots((prev)=>prev = result);
        // console.log(slots, result)
       }else{
        navigate("/DashBoard/Locations")
       }
      }
      setMsg((prev)=>prev="Please go Back and Try again!");
    }
    status()
  }, [slots!==""])
  return (
    <>
     {msg ? <h1>{msg}</h1>:
         <div className='SlorGrid' >
         {slots? <div className='content'>{slots.map((slot)=>{
         return <Slots key={slot._id} info={slot}/>
       })}</div>:"NO Slot available"}
     
     </div>}
    </>
  )
}

export default SlorGrid

