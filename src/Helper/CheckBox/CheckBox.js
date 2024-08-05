import React, { useEffect,  useState } from "react";
import "./CheckBox.css";

const CheckBox = ({  text = "",
  style,
  textStyle = {},
  size = 15,
  value = false,
  onChange=()=>{},
  className=''}) => {
//states
const [checked, setChecked] = useState(value);

    // handling methods
    const handleChecking = () => {setChecked((prev)=>{
      onChange(!prev);
      return !prev
    })}

    // rendering
    useEffect(()=>{
      setChecked(value)
    },[value])

  return (
    <div style={style} onClick={handleChecking} className={`checkbox-container ${className}`}>
          <div
        style={{ width: size, height: size }}
        className={`checkbox ${checked ? "active" : ""}`}
      >
        {checked ? <p style={{fontSize:size}}>&#10003;</p> : null}
      </div>
      <h3 style={textStyle}>{text}</h3>
    </div>
  )
}

export default CheckBox
