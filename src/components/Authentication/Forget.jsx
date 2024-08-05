import React, { useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { Constants, sendEmail, validateEmail } from "../../Helper/Helper";
import Loader from "../Loader/Loader";
import { onValue, ref } from "firebase/database";
import { db } from "../../Firebase";
import toast from "react-hot-toast";
import { generateOTP } from "../../Helper/Helper";

const Forget = ({ setComponent, setOTP, setUpdateData }) => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleForm = async (e) => {
    e.preventDefault();
    setLoader((prev) => !prev);
    if (validateEmail(email)) {
      try {
        let flag = false;
        onValue(ref(db, `users/`), (snapshot) => {
          const data = snapshot.val();
          Object.values(data).forEach((user, i) => {
            if (user.email.toLocaleLowerCase() === email.toLocaleLowerCase()) {
              setUpdateData({ id: Object.keys(data)[i], user });
              flag = true;
            }
          });
        });
        if (!flag) {
          toast.error("Email is not Registered yet!");
        } else {
          const otp = generateOTP(5);
          const data = await sendEmail(
            email,
            `Your OTP for updating the password is ${otp}`
          );
          if (data.success) {
            toast.success("OTP is sent to the mail");
            setOTP(otp);
            setComponent(Constants.OTP);
          } else {
            toast.error("OTP is not sent due to some error.");
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Email is in the form example@example.com");
    }
    setLoader((prev) => !prev);
  };

  return (
    <div className="login">
      <span className="back" onClick={() => setComponent(Constants.LOGIN)}>
        <AiOutlineLeft />
        Back
      </span>
      <div className="head">
        <h3>Forgot Password</h3>
        <h5>
          PEnter your registered email address. we’ll send you a code to reset
          your password.
        </h5>
      </div>
      <form
        onSubmit={(e) => {
          handleForm(e);
        }}
      >
        <div className="inputcontrol">
          <label
            onClick={(e) => e.target.parentNode.children[1].focus()}
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {loader ? (
          <Loader fullWidth={true} size={50} />
        ) : (
          <input type="submit" value="Send OTP" />
        )}
      </form>
    </div>
  );
};

export default Forget;
