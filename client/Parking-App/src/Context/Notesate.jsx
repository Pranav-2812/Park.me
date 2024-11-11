import React, { useState } from 'react'
import noteContext from './Notecontext'
// import io from "socket.io-client";
const Notesate = (props) => {
  // const socket = io("http://127.0.0.1:3000/",{
  //   transports:["websocket"]
  // });
  const [data,setData] = useState(null);
  const [available, setAvail] = useState(null);
  const Fetchdata = async () => {
    props.setProgress(25)
    const response = await fetch(`http://127.0.0.1:3000/auth/AccInfo/${localStorage.getItem('acc')}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }


    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100)
      if (localStorage.getItem('acc') === "user") {
        return json.user

      } else {
        return json.owner
      }
    }
    else {
      console.log(json.error);
    }
  }
  const isAvailable = async (id) => {
    props.setProgress(25)

    const response = await fetch(`http://127.0.0.1:3000/status/isAvailable/${id}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json;
    }
    else {
      console.log(json.error);
      return false;
    }
  }
  const locationStatus = async (locid) => {
    props.setProgress(25)
    const response = await fetch(`http://127.0.0.1:3000/status/location/status/${locid}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json.vehicle

    }
    else {
      console.log(json.error);
    }
  }
  const updateSlot = async (id,duration) => {
    props.setProgress(25);
    const response = await fetch(`http://127.0.0.1:3000/status/location/slot/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({duration})
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if (json.success === true) {
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);

      console.log(json.error);
      return json;
    }
  }
  const bookSlot = async (slotId)=>{
    props.setProgress(25);
    const response = await fetch(`http://127.0.0.1:3000/status/book/slot/${slotId}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "auth-token":localStorage.getItem("token")
      },
      body:JSON.stringify({duration:35})
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if(json.success === true){
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);

      console.log(json.error);
      return json;
    }
  }
  return (
    <div>
      <noteContext.Provider value={{ Fetchdata, locationStatus,data,available,setData,setAvail,bookSlot, isAvailable, updateSlot }}>{props.children}</noteContext.Provider>
    </div>
  )
}

export default Notesate
