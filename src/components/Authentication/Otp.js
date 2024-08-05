import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { Constants } from "../../Helper/Helper";
import { toast } from "react-hot-toast";
const Otp = ({ setComponent, trueOtp }) => {
  const length = 5;
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRef = useRef([]);
  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);
  const handleChange = (i, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    if (value === "") e.target.classList.remove("active");
    else e.target.classList.add("active");
    const newOtp = [...otp];
    newOtp[i] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combineOtp = newOtp.join("");
    if (combineOtp.length === length) onOtpSubmit(combineOtp);
    if (value && i < length - 1 && inputRef.current[i + 1]) {
      inputRef.current[i + 1].focus();
    }
  };
  const handleClick = (i) => {
    inputRef.current[i].setSelectionRange(1, 1);
    if (i > 0 && !otp[i - 1]) {
      inputRef.current[otp.indexOf("")].focus();
    }
  };
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0 && inputRef.current[i - 1]) {
      inputRef.current[i - 1].focus();
    }
  };
  const onOtpSubmit = (combineOtp) => {
    if (combineOtp === trueOtp) {
      toast.success("Email Verified");
      setComponent(Constants.UPDATE_PASSWORD);
    } else {
      toast.error("Incorrect OTP");
    }
  };
  return (
    <div className="login">
      <span className="back" onClick={() => setComponent(Constants.FORGOT)}>
        <AiOutlineLeft />
        Back
      </span>
      <div className="head">
        <h3>Enter OTP</h3>
        <h5>
          We have share a code of your registered email address
          robertallen@example.com
        </h5>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onOtpSubmit();
        }}
      >
        <div className="otpControl">
          {otp.map((v, i) => (
            <input
              type="text"
              key={i}
              ref={(e) => {
                inputRef.current[i] = e;
              }}
              value={v}
              onChange={(e) => handleChange(i, e)}
              onClick={(e) => {
                handleClick(i);
              }}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        {<input type="submit" value="Verify" />}
      </form>
    </div>
  );
};

export default Otp;
