import React from 'react'
import "../styles/AuthSign.css"
import userlogo from "../asset/userlogo.png"
import ownerlogo from "../asset/ownerlogo.png"
import { Link } from 'react-router-dom'
const AuthLog = () => {
    return (
        <div className='sign'>
            <div className="container">
                <div className="box">
                    <img src={userlogo}></img>
                    <h3><Link className='box-txt' to={"/UserLog"}>User</Link></h3>
                </div>

                <div className="box">
                    <img src={ownerlogo}></img>
                    <h3><Link className='box-txt' to={"/ownerLog"}>Owner</Link></h3>
                </div>
            </div>
        </div>
    )
}

export default AuthLog