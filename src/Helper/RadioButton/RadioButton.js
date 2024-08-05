import React, { useEffect, useRef, useState } from "react";
import "./RadioButton.css";

const RadioButton = ({
  text = "",
  style,
  textStyle = {},
  size = 15,
  value = false,
  onChange=()=>{},
  className=''
}) => {
      //States
  const [checked, setChecked] = useState(value);
  const isInitialMount = useRef(true)

    //hanlding methods
    const handleChecking = () => setChecked((prev) => !prev);

    //Rendering
  useEffect(()=>{
    if(isInitialMount.current)isInitialMount.current = false;
    else onChange(checked)
  },[checked])

  return (
    <div style={style}
      onClick={handleChecking}
      className={`radiobutton-container ${className}`}>
      <div
        style={{ width: size, height: size }}
        className={`radiobutton ${checked ? "active" : ""}`}
      ></div>
      <h3 style={textStyle}>{text}</h3>
    </div>
  )
}

export default RadioButton
