import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Alert from "../Alert/Alert";
import { Constants, encryptData } from "../../Helper/Helper";
import { ref, update } from "firebase/database";
import { db } from "../../Firebase";
import Loader from "../Loader/Loader";

const Update = ({ setComponent, updateData, setUpdateData, setOTP }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertData, setAlertData] = useState({ show: false, type: 1 });
  const [pass, setpass] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader((prev) => !prev);
    try {
      await update(ref(db, `users/${updateData.id}`), {
        ...updateData.user,
        pass: encryptData(pass),
      });
      setAlertData({
        show: true,
        type: 0,
        heading: "Password Update Successfully",
        subHeading: "Your password has been update successfully",
        onSubmit: () => {
          setAlertData({ show: false });
          setUpdateData({});
          setOTP("");
          setComponent(Constants.LOGIN);
        },
        btnText: "Back to Login",
      });
      setLoader((prev) => !prev);
    } catch (error) {
      setAlertData({
        show: true,
        type: 1,
        heading: "Password Updation Failed",
        subHeading: error,
        onSubmit: () => {
          setAlertData({ show: false });
        },
        btnText: "Try Again",
      });
      setLoader((prev) => !prev);
    }
  };
  return (
    <>
      <div className="login">
        <div className="head">
          <h3>Create New Password </h3>
          <h5>Please update your password for enhanced security.</h5>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="passcontrol">
            <div className="box">
              <label
                onClick={(e) => e.target.parentNode.children[1].focus()}
                htmlFor="pass"
              >
                Password
              </label>
              <input
                onChange={(e) => {
                  setpass(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                name="pass"
              />
            </div>
            {showPassword ? (
              <AiFillEye
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <AiFillEyeInvisible
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          {loader ? (
            <Loader fullWidth={true} size={50} />
          ) : (
            <input type="submit" value="Update Password" />
          )}
        </form>
      </div>
      {alertData.show && <Alert data={alertData} />}
    </>
  );
};

export default Update;
