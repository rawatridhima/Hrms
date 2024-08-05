import React from 'react'
import './Alert.css'
const Alert = ({data}) => {
  return (
    <div className="alert">
        <div className="box">
            <img src={require(`../../Assests/images/${data.type===0?'success.png':'failure.png'}`)} alt="" />
            <h3>{data.heading}</h3>
            <h5>{data.subHeading}</h5>
            <button onClick={data.onSubmit} >{data.btnText}</button>
        </div>
    </div>
  )
}

export default Alert
