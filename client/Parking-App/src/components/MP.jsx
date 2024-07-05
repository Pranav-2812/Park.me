import React, { useContext, useEffect, useRef, useState } from 'react'
import "../styles/MP.css"
import noteContext from '../Context/Notecontext'
import LocGrid from './LocGrid'
const MP = (props) => {
  const profDashRef = useRef(null)
  const [disp, setDisp] = useState(false);
  const[data,setMpData] = useState("");
  const[available,setMpAvail] = useState("");
  const click = () => {
    if (disp === true) {
      profDashRef.current.setAttribute("class", "prof-dash")
      setDisp(false)
    }
    else {
      profDashRef.current.setAttribute("class", "prof-dash-after")
      setDisp(true)
    }

  }
  const context = useContext(noteContext);
  const { Fetchdata,setData,setAvail, isAvailable} = context;
  useEffect(() => {
    async function getData() {
      const result = await Fetchdata();
      if(result.success ===false){
        alert(result.msg)
      }
      setData((prev)=>prev=result);
      setMpData((prev)=>prev=result);
      if (data) {
        const result1 = await isAvailable(data._id);
        if (result1 === false) {
          alert(result1.msg);
        }
        setAvail((prev)=>prev=result1);
        setMpAvail((prev)=>prev=result1);
      }

    }
    getData();
  }, [data!==""]);






  return (
    <div className='MP' >
      <div className="main-dash">
        <div className="main-content" >
          {available ? available.location ? <div className='loc_grid'>{available.location.map((loc) => {
            return <LocGrid key={loc._id} loc={loc} setProgress={props.setProgress} />
          })}</div> : <h2>Sorry,we are trying to get you there!</h2> : "Sorry no Locations availble in your city!"}
        </div>
        <div className="prof-dash" ref={profDashRef}  >
          <i className="fa-solid fa-angle-left" onClick={click}></i>
          {data ? localStorage.getItem("acc") === "user" ?
            <div className='user'>
              <p>{data.name}</p>
              <p>{data.email}</p>
              <p>{data.Mob_no}</p>
              <p>{data.vehcile_number}</p>
              <p>{data.vehcile_type}</p>
              <p>{data.city}</p>
              <p>{data.vehicles}</p>
            </div>
            : <div className='owner'>
              <p>{data.name}</p>
              <p>{data.ucc}</p>
              <p>{data.email}</p>
              <p>{data.Mob_no}</p>
              <p>{data.city}</p>
              <p>{data.locations}</p>
            </div>
            : <p>Loading data...</p>}
        </div>
      </div>

    </div>
  )
}

export default MP
