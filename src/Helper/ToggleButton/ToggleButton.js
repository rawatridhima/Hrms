import React, { useEffect, useRef, useState } from "react";
import "./ToggleButton.css";

const ToggleButton = ({ size, value = false, onToggleChange=()=>{} }) => {
  //states
  const [active, setActive] = useState(false);
  const initialMount = useRef(true);
  //rendering
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    } else {
      onToggleChange(active);
    }
  }, [active]);
  return (
    <div
      style={{ width: 2 * size, height: size }}
      className={`toggleButton ${active ? "active" : ""}`}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className="container"></div>
    </div>
  );
};

export default ToggleButton;
