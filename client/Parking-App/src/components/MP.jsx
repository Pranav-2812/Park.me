import React, { useContext, useEffect, useRef, useState } from 'react'
import "../styles/MP.css"
import noteContext from '../Context/Notecontext'
import LocGrid from './LocGrid'
import AOS from "aos"
import "aos/dist/aos.css"
const MP = (props) => {
  const profDashRef = useRef(null)
  const [disp, setDisp] = useState(false);
  const [data, setMpData] = useState("");
  const [available, setMpAvail] = useState("");
  const [permission, setPermission] = useState(false);
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
  const { Fetchdata, setData, setAvail, getUserLocation, isAvailableGen } = context;

  useEffect(() => {
    async function getData() {
      const result = await Fetchdata();
      if (result.success === false) {
        alert(result.msg)
      }
      setData((prev) => prev = result);
      setMpData((prev) => prev = result);

    }
    getData()
    AOS.init();
  }, [data !== ""]);

  useEffect(() => {
    async function getLocation() {
      try {
        const locationData = await getUserLocation(); // Waits for the promise to resolve
        console.log(locationData);

        if (locationData) {
          setPermission(prev => true);
          const cityName = locationData.results[0].address_components[3].short_name;
          console.log(cityName);
          const result = await isAvailableGen(cityName);
          handleResult(result);
          if(document.getElementById('disp-msg').style.display === "flex"){
            document.getElementById('disp-msg').style.display = "none";
          }
        }
      } catch (error) {
        console.log("Error getting location:", error); // Logs the error
        console.log("Unable to retrieve location. Permission denied or an error occurred.");
        setPermission(prev => false);
        if(document.getElementById('disp-msg')){
          
          document.getElementById('disp-msg').style.display = "flex";
        }
      }
    }

    getLocation();

  }, [])


  const handleResult = (res) => {
    setAvail((prev) => prev = res);
    setMpAvail((prev) => prev = res);
  }
  return (
    <div className='MP' >
      <div className="main-dash" >
        <div className="main-content" >
          {available || props.location ? available.location || props.location.resMsg.location ?
            <div className='loc_grid'>
              <h2 data-aos= "fade-down" data-aos-duration="1000">Available Parking Locations</h2>

              <div className="grid">
                {available.location.map((loc,i) => {
                  return <LocGrid key={loc._id} loc={loc} setProgress={props.setProgress} user={data} />
                    ||
                    props.location.resMsg.location.map((loc,i) => {
                      return <LocGrid key={loc._id} loc={loc} setProgress={props.setProgress} user={data} />
                    })
                })}
              </div>
            </div>
            : <h2>Sorry,we are trying to get you there!</h2> :
            ""
          }
          <div className="disp-msg" id='disp-msg' >
            <iframe src="https://lottie.host/embed/e98eaa1c-73cc-47ea-b1e1-105aa590e5a3/iu115agwnG.json" ></iframe>

          </div>
        </div>
        <div className="prof-dash" ref={profDashRef}  >
          <i className="fa-solid fa-angle-left" onClick={click}></i>
          {data ? localStorage.getItem("acc") === "user" ?
            <div className='user'>
              <p>{data.name}</p>
              <p>{data.email}</p>
              <p>{data.Mob_no}</p>
              <p>{data.vehicle_number}</p>
              <p>{data.vehicle_type}</p>
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
